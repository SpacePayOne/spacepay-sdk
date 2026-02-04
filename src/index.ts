// Main entry point for SpacePay Client SDK
import { SpacePay } from './client'
import type {
  BackendClientOptions,
  PaymentClientOptions,
} from './client/spacepay'
export { SpacePayBackendClient, SpacePayPaymentClient } from './client'
export type { SpacePayConfig } from './client'
export { ApiError } from './types/errors'
export {
  Currency,
  TokenType,
  AssetType,
  TokenStatus,
  DepositAddressType,
  QuoteStatus,
} from './types'
export type {
  PaymentStatus,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreateQuoteByContractRequest,
  CreateQuoteByContractDto,
  PaymentQuote,
  PaymentReceiptDto,
  PaymentDto,
  PaymentStatusDto,
  DepositAddress,
  Token,
  ChainDto,
} from './types'
export * from './utils'

export function createBackendClient(options: BackendClientOptions) {
  return SpacePay.createBackendClient(options)
}

export function createPaymentClient(options: PaymentClientOptions) {
  return SpacePay.createPaymentClient(options)
}

// Frontend embedded checkout helper
export { initEmbeddedCheckout } from './frontend-embedded'
export type {
  EmbeddedCheckoutInstance,
  EmbeddedCheckoutOptions,
} from './types/config'

export default SpacePay
