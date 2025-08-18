// Main entry point for SpacePay Client SDK
import { SpacePayClient } from './client'
export { SpacePayClient } from './client'
export { ApiError } from './types/errors'
export { Currency } from './types'
export type {
  PaymentStatus,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  CreateQuoteByContractRequest,
  PaymentQuote,
  DepositAddress,
  Token,
  ClientOptions,
} from './types'

// Default export
export default SpacePayClient
