import { createModalIframe, removeModal, appendModal } from './frontend-modal'
import { buildUrl } from './utils'
import type {
  EmbeddedWalletInstance,
  EmbeddedWalletOptions,
} from './types/config'

/**
 * Initialize the embedded wallet UI in a modal.
 *
 * Returns an instance with mount(), unmount(), and close(). Call mount() to show
 * the modal.
 *
 * Intended for browser usage via the frontend entry or the global SpacePaySDK
 * when using the CDN bundle.
 */
export function initEmbeddedWalletModal(
  options: EmbeddedWalletOptions
): EmbeddedWalletInstance {
  const { appBaseUrl } = options
  if (!appBaseUrl) {
    throw new Error('SpacePay embedded wallet: appBaseUrl is required')
  }

  const walletUrl = buildUrl(appBaseUrl, '/')
  let modalElement: HTMLDivElement | null = createModalIframe({
    src: walletUrl.toString(),
    title: 'SpacePay Wallet',
    ariaLabel: 'SpacePay Wallet',
  })
  let mounted = false

  function close(): void {
    if (modalElement) {
      removeModal(modalElement)
      modalElement = null
    }
  }

  const instance: EmbeddedWalletInstance = {
    mount(): void {
      if (mounted || !modalElement) return
      appendModal(modalElement)
      mounted = true
    },

    unmount(): void {
      mounted = false
      close()
    },

    close,
  }

  return instance
}
