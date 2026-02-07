import type { ParseResult as PPParseResult } from 'papaparse'
import type { FileWithPath } from 'react-dropzone'
import { z } from 'zod'

import { ParserId } from '@/types-enums'
import { Big } from '@/lib/w-big'

import type { NumberBig } from './global'
import { zDateTimeString, zIdString } from './global'
import type { KeysCheck } from './key-check'
import { zKeysCheck } from './key-check'

export const zParserId = z.enum([ParserId.CAPITEC, ParserId.COMDIRECT_GIRO] as const)

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

const zFileWithPath = z.custom<FileWithPath>((val) => {
  return val instanceof File
})

export type PPDataRow = string[] // We use string[] because we use `header: false` in papaparse
export type PPRawParseResult = PPParseResult<PPDataRow>

const zPPRawParseResult = z.custom<PPRawParseResult>()

export const zStatsFile = z.object({
  id: zIdString,
  file: zFileWithPath,
  uploaded: zDateTimeString,
  status: z.enum(['parsing', 'parsed', 'error']),
  parserId: zParserId.nullable(),
  parsedContentRows: z.array(zParsedContentRow),
  rawParseResult: zPPRawParseResult.optional(),
  error: z.string().optional(),
})

export type StatsFile = z.infer<typeof zStatsFile>

export const zStatsFileAtRest = z.object({
  id: zIdString,
  file: zFileWithPath,
  uploaded: zDateTimeString,
  status: z.enum(['parsing', 'parsed', 'error']),
  parserId: zParserId.nullable(),
  parsedContentRows: z.array(zParsedContentRowAtRest), // Serialized values
  rawParseResult: zPPRawParseResult.optional(),
  error: z.string().optional(),
})

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks - ensure StatsFile and StatsFileAtRest have the same keys
const assertKeysStatsFile: KeysCheck<StatsFile, StatsFileAtRest> = true
zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeysStatsFile)
