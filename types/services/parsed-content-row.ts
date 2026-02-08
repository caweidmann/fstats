import { z } from 'zod'

import { Big } from '@/lib/w-big'

import type { NumberBig } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zParsedContentRow = z.object({
  date: z.string(),
  description: z.string(),
  value: z.custom<NumberBig>((val) => val instanceof Big),
})

export type ParsedContentRow = z.infer<typeof zParsedContentRow>

export const zParsedContentRowAtRest = z.object({
  date: z.string(),
  description: z.string(),
  value: z.string(),
})

export type ParsedContentRowAtRest = z.infer<typeof zParsedContentRowAtRest>

// Safety checks
const assertKeys: _KeysCheck<ParsedContentRow, ParsedContentRowAtRest> = true
_zKeysCheck(zParsedContentRow, zParsedContentRowAtRest, assertKeys)
