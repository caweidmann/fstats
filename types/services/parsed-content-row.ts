import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zNumberString, zSystemDateString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zParsedContentRow = z.object({
  date: zSystemDateString,
  description: z.string(),
  value: zNumberString,
  currency: zCurrency,
  category: z.string(), // FIXME: type to porper cats
})

export type ParsedContentRow = z.infer<typeof zParsedContentRow>

export const zParsedContentRowAtRest = z.object({
  ...zParsedContentRow.shape,
  currency: z.string(),
})

export type ParsedContentRowAtRest = z.infer<typeof zParsedContentRowAtRest>

// Safety checks
const assertKeys: _KeysCheck<ParsedContentRow, ParsedContentRowAtRest> = true
_zKeysCheck(zParsedContentRow, zParsedContentRowAtRest, assertKeys)
