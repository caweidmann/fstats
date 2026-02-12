import { Parser } from '@/types'
import { ParserId } from '@/types-enums'

export const checkUniqueParserIds = (parsers: Record<ParserId, Parser>) => {
  const ids = Object.values(parsers).map((parser) => parser.id)
  const uniqueIds = new Set(ids)

  if (ids.length !== uniqueIds.size) {
    throw new Error('Ensure each parser has a unique ID in AVAILABLE_PARSERS!')
  }
}
