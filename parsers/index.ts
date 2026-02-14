import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'

import { CapitecSavings } from './Capitec'
import { ComdirectGiro, ComdirectVisa } from './Comdirect'
import { FnbCreditCard } from './FNB'
import { checkUniqueParserIds } from './helper'
import { IngGiro, IngGiroWb } from './ING'
import { LloydsCurrent } from './Lloyds'

export const AVAILABLE_PARSERS = {
  [ParserId.CAPITEC]: CapitecSavings,
  [ParserId.FNB]: FnbCreditCard,
  [ParserId.COMDIRECT_GIRO]: ComdirectGiro,
  [ParserId.COMDIRECT_VISA]: ComdirectVisa,
  [ParserId.ING_GIRO]: IngGiro,
  [ParserId.ING_GIRO_WB]: IngGiroWb,
  [ParserId.LLOYDS_CURRENT]: LloydsCurrent,
} satisfies Record<ParserId, Parser>

checkUniqueParserIds(AVAILABLE_PARSERS)

export const getParserCurrency = (parserId: ParserId) => {
  return AVAILABLE_PARSERS[parserId].currency
}
