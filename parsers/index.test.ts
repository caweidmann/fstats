import { describe, expect, it } from 'vitest'

import { AVAILABLE_PARSERS } from './index'

describe('parser registry', () => {
  it('has an id on every parser matching its registry key', () => {
    Object.entries(AVAILABLE_PARSERS).forEach(([key, parser]) => {
      expect(parser.id).toBe(key)
    })
  })

  it('every parser has required metadata', () => {
    Object.values(AVAILABLE_PARSERS).forEach((parser) => {
      expect(parser.bankName).toBeTruthy()
      expect(parser.accountType).toBeTruthy()
      expect(parser.currency).toBeTruthy()
      expect(parser.dateFormat).toBeTruthy()
      expect(typeof parser.detect).toBe('function')
      expect(typeof parser.parse).toBe('function')
    })
  })
})
