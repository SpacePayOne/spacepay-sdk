import { ApiError } from '../types/errors'
import { safeJson } from '../utils/validation'

// Base configuration interface
export interface SpacePayConfig {
  baseUrl: string
  publicKey: string
  timeoutMs?: number | undefined
}

// Base client class with common functionality
export abstract class BaseSpacePayClient {
  protected readonly baseUrl: string
  protected readonly publicKey: string
  protected readonly timeoutMs: number

  constructor(config: SpacePayConfig) {
    if (!config.baseUrl) throw new Error('baseUrl required')
    if (!config.publicKey) throw new Error('publicKey required')
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.publicKey = config.publicKey
    this.timeoutMs = config.timeoutMs ?? 30_000
  }

  protected async request<T>(
    path: string,
    init: RequestInit & { headers?: Record<string, string> }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), this.timeoutMs)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-SpacePay-Access-Key': this.publicKey,
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
            ? String((maybeJson as { requestId: string }).requestId)
            : undefined
        throw new ApiError(
          `HTTP ${res.status} ${res.statusText}`,
          res.status,
          maybeJson ?? text,
          reqId
        )
      }

      return typeof maybeJson === 'undefined' ? ({} as T) : (maybeJson as T)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request timeout', undefined)
      }
      if (err instanceof ApiError) throw err
      throw new ApiError(err instanceof Error ? err.message : 'Network error')
    } finally {
      clearTimeout(t)
    }
  }
}
