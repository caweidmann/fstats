import { z } from 'zod'

import { zCurrency } from '@/types-enums'
import { Big } from '@/lib/w-big'

import { zSystemDateString, type NumberBig } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zParsedContentRow = z.object({
  date: zSystemDateString,
  description: z.string(),
  value: z.custom<NumberBig>((val) => val instanceof Big),
  currency: zCurrency,
})

export type ParsedContentRow = z.infer<typeof zParsedContentRow>

export const zParsedContentRowAtRest = z.object({
  ...zParsedContentRow.shape,
  value: z.string(),
  currency: z.string(),
})

export type ParsedContentRowAtRest = z.infer<typeof zParsedContentRowAtRest>

// Safety checks
const assertKeys: _KeysCheck<ParsedContentRow, ParsedContentRowAtRest> = true
_zKeysCheck(zParsedContentRow, zParsedContentRowAtRest, assertKeys)
