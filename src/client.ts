import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  CreateQuoteByContractRequest,
  PaymentQuote,
  ClientOptions,
} from './types'
import { ApiError } from './types/errors'
import { uuid } from './utils/crypto'
import { safeJson } from './utils/validation'

/**
 * Lightweight SDK for SpacePay-like API
 * Works in Node 18+ (global fetch) and modern browsers.
 */
export class SpacePayClient {
  private readonly baseUrl: string
  private readonly publicKey: string
  private readonly secretKey: string
  private readonly timeoutMs: number

  constructor(opts: ClientOptions) {
    if (!opts.baseUrl) throw new Error('baseUrl required')
    if (!opts.publicKey) throw new Error('publicKey required')
    if (!opts.secretKey) throw new Error('secretKey required')
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '')
    this.publicKey = opts.publicKey
    this.secretKey = opts.secretKey
    this.timeoutMs = opts.config?.timeoutMs ?? 30_000
  }

  /**
   * Create a new payment
   */
  async createPayment(
    body: CreatePaymentRequest,
    opts?: { idempotencyKey?: string }
  ): Promise<CreatePaymentResponse> {
    const idem = opts?.idempotencyKey ?? uuid()
    return this.request<CreatePaymentResponse>(
      '/v1/external/secretkey-auth/payments',
      {
        method: 'POST',
        headers: { 'Idempotency-Key': idem },
        body: JSON.stringify(body),
      }
    )
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentStatusResponse>(
      `/v1/external/secretkey-auth/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
      }
    )
  }

  /**
   * Get active quotes for a payment
   */
  async getActiveQuotes(paymentId: string): Promise<PaymentQuote[]> {
    if (!paymentId) throw new Error('paymentId required')
    return this.request<PaymentQuote[]>(
      `/v1/external/payments/${encodeURIComponent(paymentId)}/quotes`,
      {
        method: 'GET',
      }
    )
  }

  /**
   * Create or update a quote by contract address and chain
   */
  async createOrUpdateQuote(
    paymentId: string,
    body: CreateQuoteByContractRequest
  ): Promise<PaymentQuote> {
    if (!paymentId) throw new Error('paymentId required')
    if (!body.contractAddress) throw new Error('contractAddress required')
    if (!body.chainId) throw new Error('chainId required')

    return this.request<PaymentQuote>(
      `/v1/external/payments/${encodeURIComponent(paymentId)}/quotes`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    )
  }

  // ---------- internals ----------

  private async request<T>(
    path: string,
    init: RequestInit & { headers?: Record<string, string> }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), this.timeoutMs)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-SpacePay-Access-Key': this.publicKey,
      'X-SpacePay-Secret-Key': this.secretKey,
      ...(init.headers ?? {}),
    } as Record<string, string>

    try {
      const res = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      })

      const text = await res.text()
      const maybeJson = safeJson(text)

      if (!res.ok) {
        const reqId =
          typeof maybeJson === 'object' && maybeJson && 'requestId' in maybeJson
            ? String((maybeJson as any).requestId)
            : undefined
        throw new ApiError(
          `HTTP ${res.status} ${res.statusText}`,
          res.status,
          maybeJson ?? text,
          reqId
        )
      }

      return typeof maybeJson === 'undefined' ? ({} as any) : (maybeJson as T)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new ApiError('Request timeout', undefined)
      }
      if (err instanceof ApiError) throw err
      throw new ApiError(err?.message ?? 'Network error')
    } finally {
      clearTimeout(t)
    }
  }
}
