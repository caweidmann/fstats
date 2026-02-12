import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro, ComdirectVisa } from './Comdirect'
import { FnbCreditCard } from './FNB'
import { checkUniqueParserIds } from './helper'

export const AVAILABLE_PARSERS = {
  [ParserId.CAPITEC]: CapitecSavings,
  [ParserId.FNB]: FnbCreditCard,
  [ParserId.COMDIRECT_GIRO]: ComdirectGiro,
  [ParserId.COMDIRECT_VISA]: ComdirectVisa,
} satisfies Record<ParserId, Parser>

checkUniqueParserIds(AVAILABLE_PARSERS)
