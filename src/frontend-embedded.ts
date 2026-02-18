/* eslint-env browser */
/* eslint-disable no-undef */

import {
  appendModal,
  createModalIframe,
  hideModal,
  removeModal,
  showModal,
} from './frontend-modal'
import { buildUrl } from './utils'
import type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
} from './types/config'

const DEFAULT_INLINE_WIDTH = '400px'
const DEFAULT_INLINE_HEIGHT = '56px'
const DEFAULT_PAYMENT_BUTTON_PATH = '/payment-button'
const DEFAULT_LOGIN_PATH = '/login'

async function resolvePaymentContext(
  options: EmbeddedCheckoutOptions
): Promise<{ paymentId: string; secret: string }> {
  if (options.fetchPaymentContext) {
    const ctx = await options.fetchPaymentContext()
    if (!ctx || !ctx.paymentId || !ctx.secret) {
      throw new Error(
        'SpacePay embedded checkout: fetchPaymentContext must return { paymentId, secret }'
      )
    }
    return ctx
  }

  if (!options.paymentId || !options.secret) {
    throw new Error(
      'SpacePay embedded checkout: provide paymentId & secret or fetchPaymentContext'
    )
  }

  return { paymentId: options.paymentId, secret: options.secret }
}

/**
 * Initialize the embedded checkout experience.
 *
 * Example:
 *   const checkout = await initEmbeddedCheckout({
 *     baseUrl: 'https://pay.spacepay.com',
 *     paymentId: '...',
 *     secret: '...',
 *   })
 *
 *   checkout.mount('#spacepay-checkout')
 */
export async function initEmbeddedCheckout(
  options: EmbeddedCheckoutOptions
): Promise<EmbeddedCheckoutInstance> {
  const {
    baseUrl,
    paymentButtonPath = DEFAULT_PAYMENT_BUTTON_PATH,
    loginPath = DEFAULT_LOGIN_PATH,
    inlineWidth = DEFAULT_INLINE_WIDTH,
    inlineHeight = DEFAULT_INLINE_HEIGHT,
  } = options

  if (!baseUrl) {
    throw new Error('SpacePay embedded checkout: baseUrl is required')
  }

  const { paymentId, secret } = await resolvePaymentContext(options)

  const paymentButtonUrl = buildUrl(baseUrl, paymentButtonPath, {
    paymentId,
    secret,
  })

  const loginUrl = buildUrl(baseUrl, loginPath)
  const allowedOrigins =
    options.allowedOrigins && options.allowedOrigins.length > 0
      ? options.allowedOrigins
      : [buildUrl(baseUrl, '/').origin]

  let inlineButtonIframe: HTMLIFrameElement | null = null
  let modalElementLogin: HTMLDivElement | null = null
  let messageHandler: ((event: MessageEvent) => void) | null = null
  let buttonMounted = false

  function ensureLoginModal() {
    if (modalElementLogin) return

    const modalElement = createModalIframe({
      src: loginUrl.toString(),
      title: 'SpacePay Login',
      ariaLabel: 'SpacePay Login',
      onBackdropClick: () => {
        hideLoginModal()
      },
    })
    hideModal(modalElement)
    appendModal(modalElement)
    modalElementLogin = modalElement
  }

  function showLoginModal() {
    ensureLoginModal()
    if (!modalElementLogin) return
    showModal(modalElementLogin)
  }

  function hideLoginModal() {
    if (!modalElementLogin) return
    hideModal(modalElementLogin)
    // Refresh the inline iframe so it can pick up any new auth cookies/state.
    if (inlineButtonIframe) {
      try {
        inlineButtonIframe.contentWindow?.location.reload()
      } catch (_err) {
        // Ignore cross-origin access issues – in worst case the iframe stays as-is.
      }
    }
  }

  function installMessageHandler() {
    if (messageHandler) return

    messageHandler = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return
      const data = event.data as unknown
      if (!data || typeof data !== 'object') return

      console.log('[🧑‍🚀 SpacePay SDK] message received:', event.origin, data)

      const payload = data as {
        type?: string
        mode?: string
        loggedIn?: boolean
      }

      if (payload.type === 'spacepay-request-login') {
        showLoginModal()
        return
      }

      if (payload.type === 'spacepay-user-authenticated') {
        const loggedIn =
          typeof payload.loggedIn === 'boolean' ? payload.loggedIn : false
        if (loggedIn) {
          hideLoginModal()
        }
      }
    }

    window.addEventListener('message', messageHandler)
  }

  function removeMessageHandler() {
    if (!messageHandler) return
    window.removeEventListener('message', messageHandler)
    messageHandler = null
  }

  const instance: EmbeddedCheckoutInstance = {
    mount(container: string | HTMLElement): void {
      if (buttonMounted) return

      const el =
        typeof container === 'string'
          ? (document.querySelector(container) as HTMLElement | null)
          : container

      if (!el) {
        throw new Error(
          'SpacePay embedded checkout: mount container not found in DOM'
        )
      }

      const iframe = document.createElement('iframe')
      iframe.src = paymentButtonUrl.toString()
      iframe.title = 'SpacePay Payment Button'
      iframe.style.border = 'none'
      iframe.style.width = inlineWidth
      iframe.style.height = inlineHeight
      iframe.style.background = 'transparent'

      // Clear previous content and insert the iframe
      while (el.firstChild) el.removeChild(el.firstChild)
      el.appendChild(iframe)

      inlineButtonIframe = iframe
      installMessageHandler()
      buttonMounted = true
    },

    unmount(): void {
      buttonMounted = false
      removeMessageHandler()

      if (inlineButtonIframe && inlineButtonIframe.parentNode) {
        inlineButtonIframe.parentNode.removeChild(inlineButtonIframe)
      }
      inlineButtonIframe = null

      if (modalElementLogin) {
        removeModal(modalElementLogin)
      }
      modalElementLogin = null
    },
  }

  return instance
}
