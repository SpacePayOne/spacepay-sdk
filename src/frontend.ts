// Frontend-only entry: payment UI / customer flow. Safe for browser; no secret key.
import { SpacePay } from './client/spacepay'
export { SpacePayPaymentClient } from './client/payment-client'
export { SpacePay } from './client/spacepay'
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
export { initEmbeddedCheckout } from './frontend-embedded'
export type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
} from './types/config'

// Convenience helpers on the frontend bundle/global.
export function createBackendClient(options: {
  baseUrl: string
  publicKey: string
  secretKey: string
  timeoutMs?: number
}) {
  return SpacePay.createBackendClient(options)
}

export function createPaymentClient(options: {
  baseUrl: string
  publicKey: string
  paymentSecret: string
  timeoutMs?: number
}) {
  return SpacePay.createPaymentClient(options)
}
