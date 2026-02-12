import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro, ComdirectVisa } from './Comdirect'

export const AVAILABLE_PARSERS = {
  [ParserId.CAPITEC]: CapitecSavings,
  [ParserId.COMDIRECT_GIRO]: ComdirectGiro,
  [ParserId.COMDIRECT_VISA]: ComdirectVisa,
} satisfies Record<ParserId, Parser>
