export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'failed'
  | 'expired'
  | 'refunded'
  | 'partially_refunded'

export interface CreatePaymentRequest {
  amount: number // amount in cents, e.g. 5000 for $50.00
  currency: 'USD' // e.g. "USD"
  orderId: string
}

export interface CreatePaymentResponse {
  id: string
  paymentAddress: string
  expiration: string // ISO
}

export interface PaymentStatusResponse {
  status: PaymentStatus
  txHash: string | null
  receivedAmount: {
    amount: number // amount in cents, e.g. 5000 for $50.00
    amountMinor: string
    currency: string
    decimals: number
  }
  chainId: number
  tokenAddress: string | null
}
