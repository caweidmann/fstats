import { describe, expect, it } from 'vitest'

import { AVAILABLE_PARSERS } from '@/utils/Parser'

describe('createParser()', () => {
  it('should ensure each parser has a detect() and parse() method', () => {
    Object.values(AVAILABLE_PARSERS).forEach((parser) => {
      expect(typeof parser.detect).toBe('function')
      expect(typeof parser.parse).toBe('function')
    })
  })
})

describe('AVAILABLE_PARSERS', () => {
  it('should should expose all parsers where parser ID matches the registry key', () => {
    Object.entries(AVAILABLE_PARSERS).forEach(([key, parser]) => {
      expect(parser.id).toBe(key)
    })
  })
})
