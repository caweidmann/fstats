import { describe, expect, it } from 'vitest'

import { AVAILABLE_PARSERS } from '@/parsers'

describe('+ Parser registry', () => {
  describe('- createParser()', () => {
    it('should ensure each parser has a detect() and parser() method', () => {
      Object.values(AVAILABLE_PARSERS).forEach((parser) => {
        expect(typeof parser.detect).toBe('function')
        expect(typeof parser.parse).toBe('function')
      })
    })
  })

  describe('- buildRegistry()', () => {
    it('should create a registry where each parser ID matches the registry key', () => {
      Object.entries(AVAILABLE_PARSERS).forEach(([key, parser]) => {
        expect(parser.id).toBe(key)
      })
    })
  })
})
