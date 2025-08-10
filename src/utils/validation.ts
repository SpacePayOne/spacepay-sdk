/**
 * Safely parse JSON string, returning undefined on failure
 */
export function safeJson(s: string): unknown | undefined {
  if (!s) return undefined
  try {
    return JSON.parse(s)
  } catch {
    return undefined
  }
}
