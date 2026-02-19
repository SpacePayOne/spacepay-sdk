import {
  clearEmbedMessageHandler,
  setEmbedMessageHandler,
} from './embed-message-handler'
import { DEFAULT_APP_BASE_URL } from './defaults'
import {
  appendModal,
  createModalIframe,
  hideModal,
  removeModal,
  showModal,
} from './frontend-modal'
import { buildUrl, resolvePaymentContext } from './utils'
import type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
  EmbeddedPaymentMessagePayload,
  EmbeddedPaymentPostMessagePayload,
} from './types/config'

const DEFAULT_INLINE_WIDTH = '400px'
const DEFAULT_INLINE_HEIGHT = '56px'

/**
 * Initialize the embedded checkout experience.
 *
 * Example:
 *   const checkout = await initEmbeddedCheckout({
 *     appBaseUrl: 'https://pay.spacepay.com',
 *     paymentId: '...',
 *     paymentSecretKey: '...',
 *   })
 *
 *   checkout.mount('#spacepay-checkout')
 */
export async function initEmbeddedCheckoutButton(
  options: EmbeddedCheckoutOptions
): Promise<EmbeddedCheckoutInstance> {
  const appBaseUrl = options.appBaseUrl ?? DEFAULT_APP_BASE_URL
  const inlineWidth = options.inlineWidth ?? DEFAULT_INLINE_WIDTH
  const inlineHeight = options.inlineHeight ?? DEFAULT_INLINE_HEIGHT

  const { paymentId, paymentSecretKey } = await resolvePaymentContext(options)

  const paymentButtonUrl = buildUrl(appBaseUrl, '/payment-button', {
    paymentId,
    secret: paymentSecretKey,
  })

  const loginUrl = buildUrl(appBaseUrl, '/')
  const allowedOrigins = [buildUrl(appBaseUrl, '/').origin]

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

      console.log(
        '[🧑‍🚀 SpacePay SDK Button] message received:',
        event.origin,
        data
      )

      const payload = data as EmbeddedPaymentPostMessagePayload

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
        return
      }

      const messagePayload: EmbeddedPaymentMessagePayload = {}
      if (payload.paymentId !== undefined)
        messagePayload.paymentId = payload.paymentId
      if (payload.paymentStatus !== undefined)
        messagePayload.paymentStatus = payload.paymentStatus

      if (payload.type === 'spacepay-payment-close') {
        options.onClose?.(messagePayload)
      }
      if (payload.type === 'spacepay-payment-success') {
        options.onSuccess?.(messagePayload)
      }
      if (payload.type === 'spacepay-payment-error') {
        options.onError?.(messagePayload)
      }
    }

    setEmbedMessageHandler(messageHandler)
  }

  function removeMessageHandler() {
    if (!messageHandler) return
    clearEmbedMessageHandler(messageHandler)
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
