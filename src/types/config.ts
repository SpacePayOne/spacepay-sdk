export interface ClientOptions {
  baseUrl: string // e.g. "https://api.spacepay.com"
  publicKey: string // merchant public key (identification)
  secretKey: string // merchant secret key (Bearer auth)
  config?: {
    timeoutMs?: number // default 30_000
  }
}
