/* eslint-env browser */

import { createModalIframe, removeModal, appendModal } from './frontend-modal'
import { buildUrl } from './utils'
import type {
  EmbeddedWalletInstance,
  EmbeddedWalletOptions,
} from './types/config'

/**
 * Open the main SpacePay wallet UI in an iframe.
 *
 * This is a simple helper intended for browser usage via the frontend entry
 * or the global SpacePaySDK when using the CDN bundle.
 */
export function openWallet(
  options: EmbeddedWalletOptions
): EmbeddedWalletInstance {
  const { baseUrl } = options
  if (!baseUrl) {
    throw new Error('SpacePay embedded wallet: baseUrl is required')
  }

  const walletUrl = buildUrl(baseUrl, '/')
  const modalElement = createModalIframe({
    src: walletUrl.toString(),
    title: 'SpacePay Wallet',
    ariaLabel: 'SpacePay Wallet',
  })

  appendModal(modalElement)

  function close(): void {
    removeModal(modalElement)
  }

  return { close }
}
