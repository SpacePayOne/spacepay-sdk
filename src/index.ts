// Main entry point for SpacePay Client SDK
import { SpacePayClient } from './client'
export { SpacePayClient } from './client'
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
  PaymentStatusResponse,
  CreateQuoteByContractRequest,
  CreateQuoteByContractDto,
  PaymentQuote,
  PaymentReceiptDto,
  PaymentDto,
  PaymentStatusDto,
  DepositAddress,
  Token,
  ChainDto,
  ClientOptions,
} from './types'

// Default export
export default SpacePayClient
