// Global test setup
import { jest } from '@jest/globals'

// Mock fetch globally for tests
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-1234-5678-9abc-def012345678',
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
  },
  writable: true,
})

// Mock AbortController
global.AbortController = class MockAbortController {
  signal = { aborted: false }
  abort() {
    this.signal.aborted = true
  }
} as any

// Mock setTimeout and clearTimeout
const originalSetTimeout = global.setTimeout
const originalClearTimeout = global.clearTimeout

global.setTimeout = jest.fn((callback: any, delay: number) => {
  return originalSetTimeout(callback, delay)
}) as any

global.clearTimeout = jest.fn((id: any) => {
  originalClearTimeout(id)
}) as any
