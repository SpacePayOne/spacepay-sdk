import { describe, it, expect } from '@jest/globals'
import { ApiError } from '../src/types/errors'

describe('ApiError', () => {
  it('should create ApiError with message', () => {
    const error = new ApiError('Test error message')

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Test error message')
    expect(error.name).toBe('ApiError')
    expect(error.status).toBeUndefined()
    expect(error.body).toBeUndefined()
    expect(error.requestId).toBeUndefined()
  })

  it('should create ApiError with status', () => {
    const error = new ApiError('Bad Request', 400)

    expect(error.message).toBe('Bad Request')
    expect(error.status).toBe(400)
    expect(error.body).toBeUndefined()
    expect(error.requestId).toBeUndefined()
  })

  it('should create ApiError with data', () => {
    const errorData = { error: 'Invalid input', field: 'amount' }
    const error = new ApiError('Validation failed', 422, errorData)

    expect(error.message).toBe('Validation failed')
    expect(error.status).toBe(422)
    expect(error.body).toEqual(errorData)
    expect(error.requestId).toBeUndefined()
  })

  it('should create ApiError with requestId', () => {
    const error = new ApiError('Server error', 500, undefined, 'req_12345')

    expect(error.message).toBe('Server error')
    expect(error.status).toBe(500)
    expect(error.body).toBeUndefined()
    expect(error.requestId).toBe('req_12345')
  })

  it('should create ApiError with all parameters', () => {
    const errorData = { error: 'Rate limited' }
    const error = new ApiError('Too many requests', 429, errorData, 'req_67890')

    expect(error.message).toBe('Too many requests')
    expect(error.status).toBe(429)
    expect(error.body).toEqual(errorData)
    expect(error.requestId).toBe('req_67890')
  })

  it('should inherit from Error', () => {
    const error = new ApiError('Test error')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.stack).toBeDefined()
  })

  it('should have correct error name', () => {
    const error = new ApiError('Test error')

    expect(error.name).toBe('ApiError')
  })
})
