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
  redirectUrl?: string // URL to redirect after successful payment
  customMetadata?: string // Arbitrary metadata for redirect URL query string
}

export interface CreatePaymentResponse {
  paymentUrl: string // URL of the payment screen
  secret: string // Secret of the payment
  paymentId: string // Payment ID
  payment: PaymentDto // Payment object
}

// New DTO structure matching the API updates
export interface CreatePaymentRequestDto {
  orderId: string
  amount: number // amount in cents, e.g. 100 for $1.00
  currency: Currency
  redirectUrl?: string
  customMetadata?: string
}

export interface CreatePaymentResponseDto {
  paymentUrl: string
  secret: string
  paymentId: string
  payment: PaymentDto
}

export interface PaymentDto {
  id: string
  merchantId: string
  amountInCents: number
  currency: Currency
  status: PaymentStatus
  depositAddress: DepositAddress | null
  quotes: PaymentQuote[]
  receipt: PaymentReceiptDto | null
  createdAt: string
}

export interface PaymentStatusDto {
  id: string
  status: PaymentStatus
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

export interface CreateQuoteByContractDto {
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

export interface PaymentReceiptDto {
  paymentId: string
  selectedQuote: PaymentQuote
  settledToken: Token
  settledChain: ChainDto
  settledAmountAsset: string
  settledAmountUsd: string
  txHash: string | null
  txBlockNumber: number | null
  txTimestamp: string | null
  txSenderAddress: string | null
  createdAt: string
}

export interface DepositAddress {
  id: string
  paymentId: string
  type: DepositAddressType
  address: string
  createdAt: Date
}

// Token-related enums
export enum TokenType {
  STABLECOIN = 'stablecoin',
  VOLATILE = 'volatile',
}

export enum AssetType {
  NATIVE = 'native',
  ERC20 = 'erc20',
}

export enum TokenStatus {
  ACTIVE = 'active',
  DEPRECATED = 'deprecated',
  BLOCKED = 'blocked',
}

// Chain DTO interface
export interface ChainDto {
  chainId: number
  name: string
  nativeSymbol: string
  nativeDecimals: number
  isEnabled: boolean
}

export interface Token {
  id: string
  coingeckoApiId: string
  chain: ChainDto
  symbol: string
  contractAddress: string
  decimals: number
  type: TokenType
  assetType: AssetType
  status: TokenStatus
  tokenPriceUsd: number | null
}

// Deposit address and quote status enums
export enum DepositAddressType {
  EVM = 'EVM',
}

export enum QuoteStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED = 'used',
}
