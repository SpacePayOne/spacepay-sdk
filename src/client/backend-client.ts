import { v4 as uuidv4 } from 'uuid'
import { BaseSpacePayClient } from './base-client'
import type { SpacePayConfig } from './base-client'
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentDto,
} from '../types'

/**
 * Backend client for merchant operations using secret key authentication
 */
export class SpacePayBackendClient extends BaseSpacePayClient {
  private readonly secretKey: string

  constructor(config: SpacePayConfig, secretKey: string) {
    super(config)
    if (!secretKey) throw new Error('secretKey required')
    this.secretKey = secretKey
  }

  /**
   * Create a new payment
   */
  async createPayment(
    body: CreatePaymentRequest,
    opts?: { idempotencyKey?: string }
  ): Promise<CreatePaymentResponse> {
    const idem = opts?.idempotencyKey ?? uuidv4()
    return this.request<CreatePaymentResponse>(
      '/v1/external/secretkey-auth/payments',
      {
        method: 'POST',
        headers: {
          'Idempotency-Key': idem,
          'X-SpacePay-Secret-Key': this.secretKey,
        },
        body: JSON.stringify(body),
      }
    )
  }

  /**
   * Get payment details by ID using secret key
   */
  async getPaymentDetails(paymentId: string): Promise<PaymentDto> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentDto>(
      `/v1/external/secretkey-auth/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: { 'X-SpacePay-Secret-Key': this.secretKey },
      }
    )
  }
}
