export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'cancelled'

export enum Currency {
  USD = 'USD',
}

// Payment limits
export const MIN_SUPPORTED_PAYMENT_AMOUNT = 1_00 // 1 USD
export const MAX_SUPPORTED_PAYMENT_AMOUNT = 1_000_000_00 // 1,000,000 USD

export interface CreatePaymentRequest {
  orderId: string
  amount: number // amount in cents, e.g. 5000 for $50.00
  currency: Currency // e.g. "USD"
}

export interface CreatePaymentResponse {
  id: string
  merchantId: string
  amountInCents: number
  currency: Currency
  status: PaymentStatus
  depositAddress: DepositAddress
  quotes: PaymentQuote[]
  createdAt: Date
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

// Payment Quotes Types
export interface CreateQuoteByContractRequest {
  contractAddress: string
  chainId: number
}

export interface PaymentQuote {
  id: string
  paymentId: string
  token: Token
  chainId: number
  expectedAmountAsset: string
  rateUsdAsset: number
  expiresAt: Date
  status: QuoteStatus
  createdAt: Date
}

export interface DepositAddress {
  id: string
  paymentId: string
  type: DepositAddressType
  address: string
  createdAt: Date
}

export interface Token {
  // Placeholder - will be updated when TokenDto structure is provided
  id: string
  contractAddress: string
  chainId: number
  symbol: string
  decimals: number
}

// Placeholder enums - will be updated when actual values are provided
export type DepositAddressType = string
export type QuoteStatus = string
