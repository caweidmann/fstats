import { z } from 'zod'

import { zDateTimeString, zIdString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'
import { zPPRawParseResult } from '../lib/papaparse'
import { zRDFileWithPath } from '../lib/react-dropzone'
import { zParserId } from '../parser'
import { zParsedContentRow, zParsedContentRowAtRest } from './parsed-content-row'

export const zStatsFile = z.object({
  id: zIdString,
  file: zRDFileWithPath,
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
  file: zRDFileWithPath,
  uploaded: zDateTimeString,
  status: z.enum(['parsing', 'parsed', 'error']),
  parserId: zParserId.nullable(),
  parsedContentRows: z.array(zParsedContentRowAtRest),
  rawParseResult: zPPRawParseResult.optional(),
  error: z.string().optional(),
})

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks - ensure StatsFile and StatsFileAtRest have the same keys
const assertKeysStatsFile: _KeysCheck<StatsFile, StatsFileAtRest> = true
_zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeysStatsFile)
