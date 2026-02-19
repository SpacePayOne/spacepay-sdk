// Frontend-only entry: payment UI / customer flow. Safe for browser; no secret key.
export { SpacePayCheckoutClient } from './client/checkout-client'
export { createCheckoutClient } from './client/spacepay'
export type { SpacePayConfig } from './client/base-client'
export { ApiError } from './types/errors'
export {
  Currency,
  TokenType,
  AssetType,
  TokenStatus,
  DepositAddressType,
  QuoteStatus,
} from './types/payment'
export type {
  PaymentStatus,
  CreateQuoteByContractRequest,
  PaymentQuote,
  PaymentReceiptDto,
  PaymentDto,
  PaymentStatusDto,
  DepositAddress,
  Token,
  ChainDto,
} from './types/payment'
export * from './utils'

// Embedded checkout (iframe + postMessage helper)
export { initEmbeddedCheckoutButton } from './frontend-embedded-button'
export type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
  EmbeddedPaymentMessagePayload,
  EmbeddedPaymentModalInstance,
  EmbeddedPaymentModalOptions,
  EmbeddedWalletInstance,
  EmbeddedWalletOptions,
} from './types/config'

// Embedded payment helper (modal-only)
export { initEmbeddedCheckoutModal } from './frontend-embedded-checkout'

// Embedded wallet helper (modal-only for now)
export { initEmbeddedWalletModal } from './frontend-embedded-wallet'
