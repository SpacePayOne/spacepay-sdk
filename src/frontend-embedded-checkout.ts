import { DEFAULT_APP_BASE_URL } from './defaults'
import { createModalIframe, removeModal, appendModal } from './frontend-modal'
import { buildUrl, resolvePaymentContext } from './utils'
import type {
  EmbeddedPaymentMessagePayload,
  EmbeddedPaymentModalInstance,
  EmbeddedPaymentModalOptions,
} from './types/config'

/**
 * Open the embedded full payment UI in a modal.
 *
 * Returns an instance with mount(), unmount(), and close(). Call mount() to show
 * the modal; the modal listens for postMessage "spacepay-payment-close" and
 * closes when received.
 *
 * Intended for browser usage via the frontend entry or the global SpacePaySDK
 * when using the CDN bundle.
 */
export async function initEmbeddedCheckoutModal(
  options: EmbeddedPaymentModalOptions
): Promise<EmbeddedPaymentModalInstance> {
  const appBaseUrl = options.appBaseUrl ?? DEFAULT_APP_BASE_URL
  const { paymentId, paymentSecretKey } = await resolvePaymentContext(options)

  const paymentUrl = buildUrl(appBaseUrl, '/payment', {
    paymentId,
    secret: paymentSecretKey,
  })

  const allowedOrigins = [buildUrl(appBaseUrl, '/').origin]
  let modalElement: HTMLDivElement | null = createModalIframe({
    src: paymentUrl.toString(),
    title: 'SpacePay Payment',
    ariaLabel: 'SpacePay Payment',
  })
  let messageHandler: ((event: MessageEvent) => void) | null = null
  let mounted = false

  function close(): void {
    if (modalElement) {
      removeModal(modalElement)
      modalElement = null
    }
  }

  function installMessageHandler(): void {
    if (messageHandler) return

    messageHandler = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return
      const data = event.data as unknown
      if (!data || typeof data !== 'object') return

      console.log('[🧑‍🚀 SpacePay SDK] message received:', event.origin, data)

      const payload = data as {
        type?: string
        paymentId?: string
        paymentStatus?: string
      }
      const messagePayload: EmbeddedPaymentMessagePayload = {}
      if (payload.paymentId !== undefined)
        messagePayload.paymentId = payload.paymentId
      if (payload.paymentStatus !== undefined)
        messagePayload.paymentStatus = payload.paymentStatus

      if (payload.type === 'spacepay-payment-close') {
        options.onClose?.(messagePayload)
        close()
      }
      if (payload.type === 'spacepay-payment-success') {
        options.onSuccess?.(messagePayload)
      }
      if (payload.type === 'spacepay-payment-error') {
        options.onError?.(messagePayload)
      }
    }

    window.addEventListener('message', messageHandler)
  }

  function removeMessageHandler(): void {
    if (!messageHandler) return
    window.removeEventListener('message', messageHandler)
    messageHandler = null
  }

  const instance: EmbeddedPaymentModalInstance = {
    mount(): void {
      if (mounted || !modalElement) return
      appendModal(modalElement)
      installMessageHandler()
      mounted = true
    },

    unmount(): void {
      mounted = false
      removeMessageHandler()
      close()
    },

    close,
  }

  return instance
}
