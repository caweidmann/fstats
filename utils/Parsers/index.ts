import type { Parser } from '@/types'
import { SupportedParsers } from '@/types-enums'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro } from './Comdirect'

export const AVAILABLE_PARSERS = {
  [SupportedParsers.CAPITEC]: CapitecSavings,
  [SupportedParsers.COMDIRECT_GIRO]: ComdirectGiro,
} satisfies Record<Exclude<SupportedParsers, 'unknown'>, Parser>
