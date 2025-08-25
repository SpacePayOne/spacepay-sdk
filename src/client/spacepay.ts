import { SpacePayBackendClient } from './backend-client'
import { SpacePayPaymentClient } from './payment-client'
import type { SpacePayConfig } from './base-client'

/**
 * Main SpacePay class with static factory methods
 */
export class SpacePay {
  /**
   * Create a backend client for merchant operations using secret key authentication
   */
  static createBackendClient(options: {
    baseUrl: string
    publicKey: string
    secretKey: string
    timeoutMs?: number
  }): SpacePayBackendClient {
    const config: SpacePayConfig = {
      baseUrl: options.baseUrl,
      publicKey: options.publicKey,
      timeoutMs: options.timeoutMs,
    }
    return new SpacePayBackendClient(config, options.secretKey)
  }

  /**
   * Create a payment client for frontend operations using payment secret authentication
   */
  static createPaymentClient(options: {
    baseUrl: string
    publicKey: string
    paymentSecret: string
    timeoutMs?: number
  }): SpacePayPaymentClient {
    const config: SpacePayConfig = {
      baseUrl: options.baseUrl,
      publicKey: options.publicKey,
      timeoutMs: options.timeoutMs,
    }
    return new SpacePayPaymentClient(config, options.paymentSecret)
  }
}
