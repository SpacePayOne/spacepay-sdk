export interface ClientOptions {
  baseUrl: string // e.g. "https://api.spacepay.com"
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
   * Base URL of the SpacePay frontend, e.g. "https://pay.spacepay.com".
   */
  baseUrl: string

  /**
   * Path for the embedded payment button/page relative to baseUrl.
   * Defaults to "/payment-button".
   */
  paymentButtonPath?: string

  /**
   * Path for the login/top-up experience relative to baseUrl.
   * Defaults to "/login".
   */
  loginPath?: string

  /**
   * Payment identifier for the checkout flow.
   * Either provide this pair directly, or use fetchPaymentContext.
   */
  paymentId?: string

  /**
   * Secret/token associated with the payment.
   * Either provide this pair directly, or use fetchPaymentContext.
   */
  secret?: string

  /**
   * Optional async callback to retrieve the paymentId/secret pair.
   * If provided, it takes precedence over the direct paymentId/secret fields.
   */
  fetchPaymentContext?: () => Promise<{ paymentId: string; secret: string }>

  /**
   * Width of the inline button iframe in pixels. Default: 400.
   */
  inlineWidth?: number

  /**
   * Height of the inline button iframe in pixels. Default: 56.
   */
  inlineHeight?: number

  /**
   * Restrict which origins are allowed to postMessage into the host page.
   * Defaults to [new URL(baseUrl).origin].
   */
  allowedOrigins?: string[]
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
