import { describe, it, expect, beforeEach } from '@jest/globals'
import { uuid } from '../src/utils/crypto'
import { safeJson } from '../src/utils/validation'

describe('Utility Functions', () => {
  describe('crypto', () => {
    describe('uuid', () => {
      it('should generate unique UUIDs', () => {
        const uuid1 = uuid()
        const uuid2 = uuid()

        expect(uuid1).toBeDefined()
        expect(uuid2).toBeDefined()
        expect(uuid1).not.toBe(uuid2)
        expect(typeof uuid1).toBe('string')
        expect(uuid1.length).toBeGreaterThan(0)
      })

      it('should generate consistent UUIDs in test environment', () => {
        // In test environment, crypto.randomUUID is mocked to return consistent value
        const uuid1 = uuid()
        const uuid2 = uuid()

        expect(uuid1).toBe('test-uuid-1234-5678-9abc-def012345678')
        expect(uuid2).toBe('test-uuid-1234-5678-9abc-def012345678')
      })
    })
  })

  describe('validation', () => {
    describe('safeJson', () => {
      it('should parse valid JSON strings', () => {
        const validJson = '{"key": "value", "number": 42}'
        const result = safeJson(validJson)

        expect(result).toEqual({ key: 'value', number: 42 })
      })

      it('should return undefined for invalid JSON', () => {
        const invalidJson = '{"key": "value", "number": 42'
        const result = safeJson(invalidJson)

        expect(result).toBeUndefined()
      })

      it('should return undefined for empty string', () => {
        const result = safeJson('')
        expect(result).toBeUndefined()
      })

      it('should return undefined for whitespace-only string', () => {
        const result = safeJson('   \n\t  ')
        expect(result).toBeUndefined()
      })

      it('should parse JSON with nested objects', () => {
        const nestedJson = '{"user": {"name": "John", "age": 30}}'
        const result = safeJson(nestedJson)

        expect(result).toEqual({ user: { name: 'John', age: 30 } })
      })

      it('should parse JSON with arrays', () => {
        const arrayJson = '{"items": [1, 2, 3], "names": ["a", "b"]}'
        const result = safeJson(arrayJson)

        expect(result).toEqual({ items: [1, 2, 3], names: ['a', 'b'] })
      })
    })
  })
})
