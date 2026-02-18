// Main entry point for SpacePay Client SDK
import { createBackendClient, createCheckoutClient } from './client/spacepay'
export * from './frontend'
export * from './backend'

const SpacePay = {
  createBackendClient,
  createCheckoutClient,
}

export default SpacePay
