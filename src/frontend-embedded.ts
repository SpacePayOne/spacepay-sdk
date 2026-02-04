/* eslint-env browser */

/* eslint-env browser */
/* eslint-disable no-undef */

import type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
} from './types/config'

const DEFAULT_INLINE_WIDTH = 400
const DEFAULT_INLINE_HEIGHT = 56
const DEFAULT_PAYMENT_BUTTON_PATH = '/payment-button'
const DEFAULT_LOGIN_PATH = '/login'

function buildUrl(baseUrl: string, path: string): URL {
  // new URL handles both absolute and relative paths
  return new URL(path, baseUrl)
}

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

  const paymentButtonUrl = buildUrl(baseUrl, paymentButtonPath)
  paymentButtonUrl.searchParams.set('paymentId', paymentId)
  paymentButtonUrl.searchParams.set('secret', secret)

  const loginUrl = buildUrl(baseUrl, loginPath).toString()
  const allowedOrigins =
    options.allowedOrigins && options.allowedOrigins.length > 0
      ? options.allowedOrigins
      : [buildUrl(baseUrl, '/').origin]

  let inlineIframe: HTMLIFrameElement | null = null
  let modalBackdrop: HTMLDivElement | null = null
  let messageHandler: ((event: MessageEvent) => void) | null = null
  let mounted = false

  function ensureModal() {
    if (modalBackdrop) return

    const backdrop = document.createElement('div')
    backdrop.setAttribute('role', 'dialog')
    backdrop.setAttribute('aria-modal', 'true')
    backdrop.setAttribute('aria-label', 'SpacePay login')
    backdrop.style.position = 'fixed'
    backdrop.style.inset = '0'
    backdrop.style.background = 'rgba(0, 0, 0, 0.6)'
    backdrop.style.display = 'flex'
    backdrop.style.alignItems = 'center'
    backdrop.style.justifyContent = 'center'
    backdrop.style.zIndex = '1000'
    backdrop.style.padding = '24px'
    backdrop.style.boxSizing = 'border-box'
    backdrop.hidden = true

    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.maxWidth = '480px'
    inner.style.height = '80vh'
    inner.style.maxHeight = '560px'
    inner.style.borderRadius = '8px'
    inner.style.overflow = 'hidden'
    inner.style.position = 'relative'
    inner.style.background = 'transparent'

    const iframe = document.createElement('iframe')
    iframe.src = loginUrl
    iframe.title = 'SpacePay login'
    iframe.style.position = 'absolute'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'
    iframe.style.background = 'transparent'

    inner.appendChild(iframe)
    backdrop.appendChild(inner)
    document.body.appendChild(backdrop)

    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        hideModal()
      }
    })

    modalBackdrop = backdrop
  }

  function showModal() {
    ensureModal()
    if (!modalBackdrop) return
    modalBackdrop.hidden = false
    modalBackdrop.style.display = 'flex'
  }

  function hideModal() {
    if (!modalBackdrop) return
    modalBackdrop.hidden = true
    modalBackdrop.style.display = 'none'
    // Refresh the inline iframe so it can pick up any new auth cookies/state.
    if (inlineIframe) {
      try {
        inlineIframe.contentWindow?.location.reload()
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

      console.log('[SpacePay] embedded message from', event.origin, data)

      const payload = data as {
        type?: string
        mode?: string
        loggedIn?: boolean
      }

      if (payload.type === 'spacepay-request-login') {
        showModal()
        return
      }

      if (payload.type === 'spacepay-user-authenticated') {
        const loggedIn =
          typeof payload.loggedIn === 'boolean' ? payload.loggedIn : false
        if (loggedIn) {
          hideModal()
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
      if (mounted) return

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
      iframe.style.width = `${inlineWidth}px`
      iframe.style.height = `${inlineHeight}px`
      iframe.style.background = 'transparent'

      // Clear previous content and insert the iframe
      while (el.firstChild) el.removeChild(el.firstChild)
      el.appendChild(iframe)

      inlineIframe = iframe
      installMessageHandler()
      mounted = true
    },

    unmount(): void {
      mounted = false
      removeMessageHandler()

      if (inlineIframe && inlineIframe.parentNode) {
        inlineIframe.parentNode.removeChild(inlineIframe)
      }
      inlineIframe = null

      if (modalBackdrop && modalBackdrop.parentNode) {
        modalBackdrop.parentNode.removeChild(modalBackdrop)
      }
      modalBackdrop = null
    },
  }

  return instance
}
