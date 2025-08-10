/**
 * Generate a UUID v4 string
 * Uses crypto.randomUUID if available (Node 19+/modern browsers)
 * Falls back to RFC4122 v4-ish implementation
 */
export function uuid(): string {
  // Use crypto.randomUUID if available (Node 19+/modern browsers)
  const g: any = globalThis as any
  if (g?.crypto?.randomUUID) return g.crypto.randomUUID()

  // Fallback RFC4122 v4-ish
  const rnd = (n = 16) =>
    Array.from(cryptoGetRandomValues(n))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  return [
    rnd(4),
    rnd(2),
    `4${rnd(1)[0]}${rnd(1).slice(1)}`,
    `${((8 + Math.random() * 4) | 0).toString(16)}${rnd(1).slice(1)}`,
    rnd(6),
  ]
    .join('-')
    .slice(0, 36)
}

/**
 * Get cryptographically secure random values
 * Works in Node 18+ (global fetch) and modern browsers
 */
export function cryptoGetRandomValues(n: number): Uint8Array {
  const g: any = globalThis as any
  if (g?.crypto?.getRandomValues) {
    const u = new Uint8Array(n)
    g.crypto.getRandomValues(u)
    return u
  }
  // Node <19 fallback
  const { randomBytes } = require('crypto')
  return new Uint8Array(randomBytes(n))
}
