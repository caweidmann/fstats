import type { Parser } from '@/types'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro } from './Comdirect'

export const AVAILABLE_PARSERS: Record<'capitec__savings' | 'comdirect__giro', Parser> = {
  capitec__savings: CapitecSavings,
  comdirect__giro: ComdirectGiro,
}
