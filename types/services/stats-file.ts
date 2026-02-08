import { z } from 'zod'

import { StatsFileStatus } from '@/types-enums'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'
import { zPPRawParseResult } from '../lib/papaparse'
import { zRDZFileWithPath } from '../lib/react-dropzone'
import { zParserId } from '../parser'
import { zParsedContentRow, zParsedContentRowAtRest } from './parsed-content-row'

export const zStatsFileStatus = z.enum([
  StatsFileStatus.PARSING,
  StatsFileStatus.PARSED,
  StatsFileStatus.ERROR,
] as const)

export const zStatsFile = z.object({
  created: z.union([z.literal(''), zDateTimeString]),
  modified: z.union([z.literal(''), zDateTimeString]),
  id: z.union([z.literal(''), zIdString]),
  file: zRDZFileWithPath,
  status: zStatsFileStatus,
  parserId: zParserId.nullable(),
  parsedContentRows: z.array(zParsedContentRow),
  rawParseResult: zPPRawParseResult.nullable(),
  error: z.string().optional(),
})

export type StatsFile = z.infer<typeof zStatsFile>

export const zSyncableStatsFile = z.object({
  ...zStatsFile.shape,
  created: zDateTimeString,
  modified: zDateTimeString,
  id: zNonEmptyString,
})

export type SyncableStatsFile = z.infer<typeof zSyncableStatsFile>

export const zStatsFileAtRest = z.object({
  ...zStatsFile.shape,
  created: zDateTimeString,
  modified: zDateTimeString,
  id: zNonEmptyString,
  parsedContentRows: z.array(zParsedContentRowAtRest),
})

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks
const assertKeys: _KeysCheck<StatsFile, StatsFileAtRest> = true
_zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeys)
