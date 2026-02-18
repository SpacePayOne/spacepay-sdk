import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import SpacePay, { SpacePayBackendClient, SpacePayCheckoutClient } from '../src'
import { Currency } from '../src/types'
import { ApiError } from '../src/types/errors'

describe('BaseSpacePayClient', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    mockFetch = jest.fn()
    global.fetch = mockFetch
  })

  describe('constructor validation', () => {
    it('should throw error when baseUrl is missing', () => {
      expect(() => {
        new SpacePayBackendClient({ baseUrl: '', publicKey: 'key' }, 'secret')
      }).toThrow('baseUrl required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: null as any, publicKey: 'key' },
          'secret'
        )
      }).toThrow('baseUrl required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: undefined as any, publicKey: 'key' },
          'secret'
        )
      }).toThrow('baseUrl required')
    })

    it('should throw error when publicKey is missing', () => {
      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: '' },
          'secret'
        )
      }).toThrow('publicKey required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: null as any },
          'secret'
        )
      }).toThrow('publicKey required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: undefined as any },
          'secret'
        )
      }).toThrow('publicKey required')
    })

    it('should normalize baseUrl by removing trailing slashes', () => {
      const client = new SpacePayBackendClient(
        { baseUrl: 'https://api.com///', publicKey: 'key' },
        'secret'
      )

      // Access protected property for testing
      expect((client as any).baseUrl).toBe('https://api.com')
    })

    it('should set default timeout when not provided', () => {
      const client = new SpacePayBackendClient(
        { baseUrl: 'https://api.com', publicKey: 'key' },
        'secret'
      )

      expect((client as any).timeoutMs).toBe(30000)
    })

    it('should use custom timeout when provided', () => {
      const client = new SpacePayBackendClient(
        { baseUrl: 'https://api.com', publicKey: 'key', timeoutMs: 60000 },
        'secret'
      )

      expect((client as any).timeoutMs).toBe(60000)
    })
  })

  describe('error handling', () => {
    let client: SpacePayBackendClient

    beforeEach(() => {
      client = new SpacePayBackendClient(
        { baseUrl: 'https://api.com', publicKey: 'key' },
        'secret'
      )
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'))

      await expect(
        client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      ).rejects.toThrow('Network failure')
    })

    it('should handle timeout errors', async () => {
      // Mock AbortController to simulate timeout
      const mockAbortController = {
        signal: { aborted: true },
        abort: jest.fn(),
      }

      global.AbortController = jest.fn(() => mockAbortController) as any

      // Mock fetch to throw AbortError
      mockFetch.mockRejectedValueOnce(new Error('AbortError'))

      await expect(
        client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      ).rejects.toThrow('AbortError')
    })

    it('should handle AbortError with correct name', async () => {
      // Create an error that looks like AbortError
      const abortError = new Error('AbortError')
      abortError.name = 'AbortError'

      mockFetch.mockRejectedValueOnce(abortError)

      await expect(
        client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      ).rejects.toThrow('Request timeout')
    })

    it('should handle non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => 'plain text response',
        json: async () => 'plain text response',
      } as Response)

      const result = await client.createPayment({
        amount: 5000,
        currency: Currency.USD,
        orderId: 'order_123',
      })

      expect(result).toEqual({})
    })

    it('should handle empty responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => '',
      } as Response)

      const result = await client.createPayment({
        amount: 5000,
        currency: Currency.USD,
        orderId: 'order_123',
      })

      expect(result).toEqual({})
    })

    it('should extract requestId from error response when available', async () => {
      const mockErrorResponse = {
        error: 'Validation failed',
        requestId: 'req_12345',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => JSON.stringify(mockErrorResponse),
        json: async () => mockErrorResponse,
      } as Response)

      try {
        await client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).requestId).toBe('req_12345')
        expect((error as ApiError).status).toBe(422)
      }
    })

    it('should handle error responses without requestId', async () => {
      const mockErrorResponse = {
        error: 'Server error',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => JSON.stringify(mockErrorResponse),
        json: async () => mockErrorResponse,
      } as Response)

      try {
        await client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        expect((error as ApiError).requestId).toBeUndefined()
        expect((error as ApiError).status).toBe(500)
      }
    })
  })
})

describe('SpacePayBackendClient', () => {
  let client: SpacePayBackendClient
  let mockFetch: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    mockFetch = jest.fn()
    global.fetch = mockFetch

    client = SpacePay.createBackendClient({
      baseUrl: 'https://api.spacepay.com',
      publicKey: 'test_public_key',
      secretKey: 'test_secret_key',
    })
  })

  describe('constructor validation', () => {
    it('should throw error when secretKey is missing', () => {
      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          ''
        )
      }).toThrow('secretKey required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          null as any
        )
      }).toThrow('secretKey required')

      expect(() => {
        new SpacePayBackendClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          undefined as any
        )
      }).toThrow('secretKey required')
    })
  })

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const mockResponse = {
        paymentUrl: 'https://spacepay.example.com/payment',
        secret: 'payment_secret_123',
        paymentId: 'pay_123',
        payment: {
          id: 'pay_123',
          status: 'pending',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.createPayment({
        amount: 5000,
        currency: Currency.USD,
        orderId: 'order_123',
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/secretkey-auth/payments',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Secret-Key': 'test_secret_key',
            'Idempotency-Key': expect.any(String),
          }),
          body: JSON.stringify({
            amount: 5000,
            currency: 'USD',
            orderId: 'order_123',
          }),
        })
      )
    })

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        error: 'Invalid amount',
        message: 'Amount must be greater than 0',
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => JSON.stringify(mockErrorResponse),
        json: async () => mockErrorResponse,
      } as Response)

      await expect(
        client.createPayment({
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        })
      ).rejects.toThrow('Bad Request')
    })

    it('should use custom idempotency key when provided', async () => {
      const mockResponse = {
        paymentUrl: 'https://spacepay.example.com/payment',
        secret: 'payment_secret_123',
        paymentId: 'pay_123',
        payment: { id: 'pay_123', status: 'pending' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      await client.createPayment(
        {
          amount: 5000,
          currency: Currency.USD,
          orderId: 'order_123',
        },
        { idempotencyKey: 'custom-key-123' }
      )

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/secretkey-auth/payments',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Idempotency-Key': 'custom-key-123',
          }),
        })
      )
    })
  })

  describe('getPaymentDetails', () => {
    it('should get payment details successfully', async () => {
      const mockResponse = {
        id: 'pay_123',
        status: 'pending',
        amountInCents: 5000,
        currency: 'USD',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.getPaymentDetails('pay_123')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/secretkey-auth/payments/pay_123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Secret-Key': 'test_secret_key',
          }),
        })
      )
    })

    it('should throw error for empty paymentId', async () => {
      await expect(client.getPaymentDetails('')).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentDetails(null as any)).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentDetails(undefined as any)).rejects.toThrow(
        'paymentId required'
      )
    })

    it('should handle payment not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => JSON.stringify({ error: 'Payment not found' }),
        json: async () => ({ error: 'Payment not found' }),
      } as Response)

      await expect(client.getPaymentDetails('nonexistent')).rejects.toThrow(
        'Not Found'
      )
    })

    it('should properly encode paymentId in URL', async () => {
      const mockResponse = { id: 'pay_123', status: 'pending' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      await client.getPaymentDetails('pay/123?test=1')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/secretkey-auth/payments/pay%2F123%3Ftest%3D1',
        expect.any(Object)
      )
    })
  })
})

describe('SpacePayPaymentClient', () => {
  let client: SpacePayCheckoutClient
  let mockFetch: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    mockFetch = jest.fn()
    global.fetch = mockFetch

    client = SpacePay.createCheckoutClient({
      baseUrl: 'https://api.spacepay.com',
      publicKey: 'test_public_key',
      paymentSecret: 'payment_secret_123',
    })
  })

  describe('constructor validation', () => {
    it('should throw error when paymentSecret is missing', () => {
      expect(() => {
        new SpacePayCheckoutClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          ''
        )
      }).toThrow('paymentSecret required')

      expect(() => {
        new SpacePayCheckoutClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          null as any
        )
      }).toThrow('paymentSecret required')

      expect(() => {
        new SpacePayCheckoutClient(
          { baseUrl: 'https://api.com', publicKey: 'key' },
          undefined as any
        )
      }).toThrow('paymentSecret required')
    })
  })

  describe('getPaymentDetails', () => {
    it('should get payment details successfully', async () => {
      const mockResponse = {
        id: 'pay_123',
        status: 'pending',
        amountInCents: 5000,
        currency: 'USD',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.getPaymentDetails('pay_123')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/payment-secret-auth/payments/pay_123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Payment-Secret': 'payment_secret_123',
          }),
        })
      )
    })

    it('should throw error for empty paymentId', async () => {
      await expect(client.getPaymentDetails('')).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentDetails(null as any)).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentDetails(undefined as any)).rejects.toThrow(
        'paymentId required'
      )
    })

    it('should properly encode paymentId in URL', async () => {
      const mockResponse = { id: 'pay_123', status: 'pending' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      await client.getPaymentDetails('pay/123?test=1')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/payment-secret-auth/payments/pay%2F123%3Ftest%3D1',
        expect.any(Object)
      )
    })
  })

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      const mockResponse = {
        status: 'confirmed',
        txHash: '0xabcdef1234567890',
        receivedAmount: {
          amount: '50.00',
          amountMinor: '5000',
          currency: 'USDC',
          decimals: 2,
        },
        chainId: 1,
        tokenAddress: '0x1234567890abcdef',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.getPaymentStatus('pay_123')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/payment-secret-auth/payments/pay_123/status',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Payment-Secret': 'payment_secret_123',
          }),
        })
      )
    })

    it('should throw error for empty paymentId', async () => {
      await expect(client.getPaymentStatus('')).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentStatus(null as any)).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getPaymentStatus(undefined as any)).rejects.toThrow(
        'paymentId required'
      )
    })

    it('should handle payment not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => JSON.stringify({ error: 'Payment not found' }),
        json: async () => ({ error: 'Payment not found' }),
      } as Response)

      await expect(client.getPaymentStatus('nonexistent')).rejects.toThrow(
        'Not Found'
      )
    })
  })

  describe('getActiveQuotes', () => {
    it('should get active quotes successfully', async () => {
      const mockResponse = [
        {
          id: 'quote_123',
          paymentId: 'pay_123',
          status: 'active',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.getActiveQuotes('pay_123')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/payment-secret-auth/payments/pay_123/quotes',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Payment-Secret': 'payment_secret_123',
          }),
        })
      )
    })

    it('should throw error for empty paymentId', async () => {
      await expect(client.getActiveQuotes('')).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getActiveQuotes(null as any)).rejects.toThrow(
        'paymentId required'
      )
      await expect(client.getActiveQuotes(undefined as any)).rejects.toThrow(
        'paymentId required'
      )
    })
  })

  describe('createOrUpdateQuote', () => {
    it('should create or update quote successfully', async () => {
      const mockResponse = {
        id: 'quote_123',
        paymentId: 'pay_123',
        status: 'active',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response)

      const result = await client.createOrUpdateQuote('pay_123', {
        contractAddress: '0x1234567890abcdef',
        chainId: 1,
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spacepay.com/v1/external/payment-secret-auth/payments/pay_123/quotes',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-SpacePay-Access-Key': 'test_public_key',
            'X-SpacePay-Payment-Secret': 'payment_secret_123',
          }),
          body: JSON.stringify({
            contractAddress: '0x1234567890abcdef',
            chainId: 1,
          }),
        })
      )
    })

    it('should throw error for empty paymentId', async () => {
      await expect(
        client.createOrUpdateQuote('', { contractAddress: '0x123', chainId: 1 })
      ).rejects.toThrow('paymentId required')

      await expect(
        client.createOrUpdateQuote(null as any, {
          contractAddress: '0x123',
          chainId: 1,
        })
      ).rejects.toThrow('paymentId required')
    })

    it('should throw error for missing contractAddress', async () => {
      await expect(
        client.createOrUpdateQuote('pay_123', {
          contractAddress: '',
          chainId: 1,
        })
      ).rejects.toThrow('contractAddress required')

      await expect(
        client.createOrUpdateQuote('pay_123', {
          contractAddress: null as any,
          chainId: 1,
        })
      ).rejects.toThrow('contractAddress required')
    })

    it('should throw error for missing chainId', async () => {
      await expect(
        client.createOrUpdateQuote('pay_123', {
          contractAddress: '0x123',
          chainId: null as any,
        })
      ).rejects.toThrow('chainId required')

      await expect(
        client.createOrUpdateQuote('pay_123', {
          contractAddress: '0x123',
          chainId: undefined as any,
        })
      ).rejects.toThrow('chainId required')
    })
  })
})

describe('SpacePay', () => {
  describe('createBackendClient', () => {
    it('should create backend client with required options', () => {
      const client = SpacePay.createBackendClient({
        baseUrl: 'https://api.spacepay.com',
        publicKey: 'test_public_key',
        secretKey: 'test_secret_key',
      })

      expect(client).toBeInstanceOf(SpacePayBackendClient)
    })

    it('should create backend client with custom timeout', () => {
      const client = SpacePay.createBackendClient({
        baseUrl: 'https://api.spacepay.com',
        publicKey: 'test_public_key',
        secretKey: 'test_secret_key',
        timeoutMs: 60000,
      })

      expect(client).toBeInstanceOf(SpacePayBackendClient)
    })
  })

  describe('createCheckoutClient', () => {
    it('should create payment client with required options', () => {
      const client = SpacePay.createCheckoutClient({
        baseUrl: 'https://api.spacepay.com',
        publicKey: 'test_public_key',
        paymentSecret: 'payment_secret_123',
      })

      expect(client).toBeInstanceOf(SpacePayCheckoutClient)
    })

    it('should create payment client with custom timeout', () => {
      const client = SpacePay.createCheckoutClient({
        baseUrl: 'https://api.spacepay.com',
        publicKey: 'test_public_key',
        paymentSecret: 'payment_secret_123',
        timeoutMs: 45000,
      })

      expect(client).toBeInstanceOf(SpacePayCheckoutClient)
    })
  })
})

// Note: Timeout testing is complex due to AbortController and setTimeout mocking
// The timeout functionality is tested indirectly through the client's error handling
