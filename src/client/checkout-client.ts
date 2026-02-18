import { BaseSpacePayClient } from './base-client'
import type { SpacePayConfig } from './base-client'
import {
  CreateQuoteByContractRequest,
  PaymentQuote,
  PaymentDto,
  PaymentStatusDto,
} from '../types'

/**
 * Checkout client for frontend operations using payment secret authentication
 */
export class SpacePayCheckoutClient extends BaseSpacePayClient {
  private readonly paymentSecret: string

  constructor(config: SpacePayConfig, paymentSecret: string) {
    super(config)
    if (!paymentSecret) throw new Error('paymentSecret required')
    this.paymentSecret = paymentSecret
  }

  /**
   * Get payment details by ID using payment secret
   */
  async getPaymentDetails(paymentId: string): Promise<PaymentDto> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentDto>(
      `/v1/external/payment-secret-auth/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: { 'X-SpacePay-Payment-Secret': this.paymentSecret },
      }
    )
  }

  /**
   * Get payment status using payment secret
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusDto> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentStatusDto>(
      `/v1/external/payment-secret-auth/payments/${encodeURIComponent(paymentId)}/status`,
      {
        method: 'GET',
        headers: { 'X-SpacePay-Payment-Secret': this.paymentSecret },
      }
    )
  }

  /**
   * Get active quotes for a payment using payment secret
   */
  async getActiveQuotes(paymentId: string): Promise<PaymentQuote[]> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentQuote[]>(
      `/v1/external/payment-secret-auth/payments/${encodeURIComponent(paymentId)}/quotes`,
      {
        method: 'GET',
        headers: { 'X-SpacePay-Payment-Secret': this.paymentSecret },
      }
    )
  }

  /**
   * Create or update a quote by contract address and chain using payment secret
   */
  async createOrUpdateQuote(
    paymentId: string,
    body: CreateQuoteByContractRequest
  ): Promise<PaymentQuote> {
    if (!paymentId) throw new Error('paymentId required')
    if (!body.contractAddress) throw new Error('contractAddress required')
    if (!body.chainId) throw new Error('chainId required')

    return this.request<PaymentQuote>(
      `/v1/external/payment-secret-auth/payments/${encodeURIComponent(paymentId)}/quotes`,
      {
        method: 'POST',
        headers: { 'X-SpacePay-Payment-Secret': this.paymentSecret },
        body: JSON.stringify(body),
      }
    )
  }
}
