// Backend-only entry: merchant server use. Do not use in browser.
export { SpacePayBackendClient } from './client/backend-client'
export { createBackendClient } from './client/spacepay'
export type { SpacePayConfig } from './client/base-client'
export { ApiError } from './types/errors'
export { Currency } from './types/payment'
export type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentDto,
  PaymentStatus,
} from './types/payment'
