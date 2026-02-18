export interface ClientOptions {
  /** API base URL. Defaults to https://api.app.spacepay.co.uk when omitted. */
  baseUrl?: string
  publicKey: string // merchant public key (identification)
  secretKey: string // merchant secret key (Bearer auth)
  config?: {
    timeoutMs?: number // default 30_000
  }
}

/**
 * Options for initializing the embedded checkout experience on the frontend.
 *
 * This SDK mirrors the pattern:
 *   const checkout = await initEmbeddedCheckout(options)
 *   checkout.mount('#checkout')
 */
export interface EmbeddedCheckoutOptions {
  /**
   * Base URL of the SpacePay frontend app. Defaults to https://app.spacepay.co.uk when omitted.
   */
  appBaseUrl?: string

  /**
   * Payment identifier for the checkout flow.
   * Either provide this pair directly, or use fetchPaymentContext.
   */
  paymentId?: string

  /**
   * Secret key/token associated with the payment.
   * Either provide this pair directly, or use fetchPaymentContext.
   */
  paymentSecretKey?: string

  /**
   * Optional async callback to retrieve the paymentId/paymentSecretKey pair.
   * If provided, it takes precedence over the direct paymentId/paymentSecretKey fields.
   */
  fetchPaymentContext?: () => Promise<{
    paymentId: string
    paymentSecretKey: string
  }>

  /**
   * Width of the inline button iframe. Default: '400px'.
   */
  inlineWidth?: string

  /**
   * Height of the inline button iframe. Default: '56px'.
   */
  inlineHeight?: string
}

export interface EmbeddedCheckoutInstance {
  /**
   * Mount the embedded checkout into a container element or selector.
   */
  mount(container: string | unknown): void

  /**
   * Remove DOM elements and event listeners associated with this instance.
   */
  unmount(): void
}

/**
 * Options for opening the main SpacePay wallet UI in an iframe.
 */
export interface EmbeddedWalletOptions {
  /**
   * Base URL of the SpacePay wallet frontend, e.g. "https://wallet.spacepay.com".
   */
  baseUrl: string
}

export interface EmbeddedWalletInstance {
  /**
   * Close the wallet UI (hides the modal or removes the inline iframe).
   */
  close(): void
}
