import type { Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { MISC } from '@/common'

import { capitec } from './banks/capitec__savings'
import comdirect__giro from './banks/comdirect__giro'
import comdirect__visa from './banks/comdirect__visa'
import fnb__credit_card from './banks/fnb__credit_card'
import ing__giro from './banks/ing__giro'
import ing__giro_wb from './banks/ing__giro_wb'
import lloyds__current from './banks/lloyds__current'

export const AVAILABLE_PARSERS: Record<ParserId, Parser> = {
  // South African Banks
  [capitec.id]: capitec,
  fnb__credit_card,

  // German Banks
  comdirect__giro,
  comdirect__visa,
  ing__giro,
  ing__giro_wb,

  // UK Banks
  lloyds__current,
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
