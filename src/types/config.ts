/**
 * Minimal options needed to resolve payment context (paymentId + paymentSecretKey).
 * Used by resolvePaymentContext and satisfied by EmbeddedCheckoutOptions and EmbeddedPaymentModalOptions.
 */
export type PaymentContextSource = {
  paymentId?: string
  paymentSecretKey?: string
  fetchPaymentContext?: () => Promise<{
    paymentId: string
    paymentSecretKey: string
  }>
}

export interface ClientOptions {
  /** API base URL. Defaults to https://api.app.spacepay.co.uk when omitted. */
  apiBaseUrl?: string
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

  /** Called when the iframe sends spacepay-payment-close. */
  onClose?: (payload: EmbeddedPaymentMessagePayload) => void
  /** Called when the iframe sends spacepay-payment-success. */
  onSuccess?: (payload: EmbeddedPaymentMessagePayload) => void
  /** Called when the iframe sends spacepay-payment-error. */
  onError?: (payload: EmbeddedPaymentMessagePayload) => void
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
   * Base URL of the SpacePay wallet/frontend app. Defaults to https://app.spacepay.co.uk when omitted.
   */
  appBaseUrl?: string
}

export interface EmbeddedWalletInstance {
  /** Show the wallet modal. */
  mount(): void
  /** Remove the modal. */
  unmount(): void
  /** Close the wallet UI (removes the modal from the DOM). */
  close(): void
}

/** Raw postMessage payload from the embedded payment/button iframe. */
export interface EmbeddedPaymentPostMessagePayload {
  type?: string
  loggedIn?: boolean
  paymentId?: string
  paymentStatus?: string
}

/** Payload passed to onClose / onSuccess / onError callbacks. */
export interface EmbeddedPaymentMessagePayload {
  paymentId?: string
  paymentStatus?: string
}

/**
 * Options for opening the embedded full payment UI in a modal.
 */
export interface EmbeddedPaymentModalOptions {
  /** Base URL of the SpacePay app. Defaults to https://app.spacepay.co.uk when omitted. */
  appBaseUrl?: string
  paymentId?: string
  paymentSecretKey?: string
  fetchPaymentContext?: () => Promise<{
    paymentId: string
    paymentSecretKey: string
  }>
  /** Called when the iframe sends spacepay-payment-close (e.g. user closed the flow). */
  onClose?: (payload: EmbeddedPaymentMessagePayload) => void
  /** Called when the iframe sends spacepay-payment-success. */
  onSuccess?: (payload: EmbeddedPaymentMessagePayload) => void
  /** Called when the iframe sends spacepay-payment-error. */
  onError?: (payload: EmbeddedPaymentMessagePayload) => void
}

/**
 * Instance returned when opening the embedded payment modal.
 */
export interface EmbeddedPaymentModalInstance {
  /** Show the payment modal and start listening for messages. */
  mount(): void
  /** Remove the modal and message listener. */
  unmount(): void
  /** Close the modal (removes it from the DOM). */
  close(): void
}
