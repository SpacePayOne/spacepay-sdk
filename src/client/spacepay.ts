import { SpacePayBackendClient } from './backend-client'
import { SpacePayCheckoutClient } from './checkout-client'
import type { SpacePayConfig } from './base-client'

export type BackendClientOptions = {
  /** API base URL. Defaults to https://api.app.spacepay.co.uk when omitted. */
  apiBaseUrl?: string | undefined
  publicKey: string
  secretKey: string
  timeoutMs?: number
}

export type CheckoutClientOptions = {
  /** API base URL. Defaults to https://api.app.spacepay.co.uk when omitted. */
  apiBaseUrl?: string | undefined
  publicKey: string
  paymentSecret: string
  timeoutMs?: number
}

/**
 * Create a checkout client for frontend operations using payment secret authentication
 */
export function createCheckoutClient(
  options: CheckoutClientOptions
): SpacePayCheckoutClient {
  const config: SpacePayConfig = {
    apiBaseUrl: options.apiBaseUrl,
    publicKey: options.publicKey,
    timeoutMs: options.timeoutMs,
  }
  return new SpacePayCheckoutClient(config, options.paymentSecret)
}

/**
 * Create a backend client for merchant operations using secret key authentication
 */
export function createBackendClient(
  options: BackendClientOptions
): SpacePayBackendClient {
  const config: SpacePayConfig = {
    apiBaseUrl: options.apiBaseUrl,
    publicKey: options.publicKey,
    timeoutMs: options.timeoutMs,
  }
  return new SpacePayBackendClient(config, options.secretKey)
}
