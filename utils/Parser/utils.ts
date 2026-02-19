import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { MISC } from '@/common'

import {
  capitec__savings,
  comdirect__giro,
  comdirect__visa,
  fnb__credit_card,
  ing__giro,
  ing__giro__wb,
  lloyds__current,
} from './banks'

export const AVAILABLE_PARSERS: Record<ParserId, Parser> = {
  // South African Banks
  [capitec__savings.id]: capitec__savings,
  [fnb__credit_card.id]: fnb__credit_card,

  // German Banks
  [comdirect__giro.id]: comdirect__giro,
  [comdirect__visa.id]: comdirect__visa,
  [ing__giro.id]: ing__giro,
  [ing__giro__wb.id]: ing__giro__wb,

  // UK Banks
  [lloyds__current.id]: lloyds__current,
}

export const getParserCurrency = (parserId: ParserId) => {
  return AVAILABLE_PARSERS[parserId].currency
}

export const getParserName = (value: ParserId | null): { short: string; long: string; alt: string } => {
  if (!value) {
    return {
      short: 'Unsupported',
      long: 'Unsupported bank format',
      alt: 'Unsupported format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
      alt: `${parser.bankName} / ${parser.accountType}`,
    }
  }

  console.warn(`Invalid parser ID: ${value}`)

  return {
    short: 'Invalid',
    long: 'Invalid parser',
    alt: 'Invalid parser',
  }
}
