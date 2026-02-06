import type { Parser } from '@/types'
import { SupportedParsers } from '@/types-enums'

import { CapitecParser } from './Capitec'

export const AVAILABLE_PARSERS: Partial<Record<SupportedParsers, Parser>> = {
  [CapitecParser.id]: CapitecParser,
}
