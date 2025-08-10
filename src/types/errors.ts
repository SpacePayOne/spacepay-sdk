export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: unknown,
    public readonly requestId?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
