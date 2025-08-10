// Main entry point for SpacePay Client SDK
import { SpacePayClient } from './client'
export { SpacePayClient } from './client'
export { ApiError } from './types/errors'
export type {
  PaymentStatus,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  ClientOptions,
} from './types'

// Default export
export default SpacePayClient
