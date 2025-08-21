import { describe, it, expect } from '@jest/globals'
import { safeJson } from '../src/utils/validation'

describe('Utility Functions', () => {
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
