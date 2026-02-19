export function buildUrl(
  baseUrl: string,
  path: string,
  searchParams: Record<string, string> = {}
): URL {
  // new URL handles both absolute and relative paths
  const url = new URL(path, baseUrl)
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value)
  }
  return url
}
