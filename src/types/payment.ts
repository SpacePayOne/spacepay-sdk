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
  currency: string // e.g. "USDC"
  chainId: number
  orderId: string
  metadata?: Record<string, any>
  returnUrl?: string
}

export interface CreatePaymentResponse {
  paymentId: string
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
