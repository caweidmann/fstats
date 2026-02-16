import { z } from 'zod'

import type { Parser } from '@/types'
import { buildRegistry } from '@/utils/CsvParser'

import capitec__savings from './banks/capitec__savings'
import comdirect__giro from './banks/comdirect__giro'
import comdirect__visa from './banks/comdirect__visa'
import fnb__credit_card from './banks/fnb__credit_card'
import ing__giro from './banks/ing__giro'
import ing__giro_wb from './banks/ing__giro_wb'
import lloyds__current from './banks/lloyds__current'

const registry = buildRegistry({
  // South African Banks
  capitec__savings,
  fnb__credit_card,

  // German Banks
  comdirect__giro,
  comdirect__visa,
  ing__giro,
  ing__giro_wb,

  // UK Banks
  lloyds__current,
})

export type ParserId = keyof typeof registry

export const ParserId = Object.fromEntries(Object.keys(registry).map((id) => [id, id])) as {
  [K in keyof typeof registry]: K
}

export const zParserId = z.enum(Object.keys(registry) as ParserId[])

export const AVAILABLE_PARSERS = registry as Record<ParserId, Parser>

export const getParserCurrency = (parserId: ParserId) => {
  return AVAILABLE_PARSERS[parserId].currency
}
