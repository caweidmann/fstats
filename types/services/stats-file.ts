import { z } from 'zod'

import { zStatsFileStatus } from '@/types-enums'
import { zParserId } from '@/parsers'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'
import { zPPRawParseResult } from '../lib/papaparse'
import { zRDZFileWithPath } from '../lib/react-dropzone'
import { zTransaction, zTransactionAtRest } from './transaction'

export const zStatsFile = z.object({
  created: z.union([z.literal(''), zDateTimeString]),
  modified: z.union([z.literal(''), zDateTimeString]),
  id: z.union([z.literal(''), zIdString]),
  /**
   * This is a hash of all transactions, not the actual parse result.
   */
  hash: z.union([z.literal(''), zNonEmptyString]),
  file: zRDZFileWithPath,
  status: zStatsFileStatus,
  parserId: zParserId.nullable(),
  parseResult: zPPRawParseResult.nullable(),
  transactions: z.array(zTransaction),
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
  ...zSyncableStatsFile.shape,
  hash: zNonEmptyString,
  transactions: z.array(zTransactionAtRest),
})

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks
const assertKeys: _KeysCheck<StatsFile, StatsFileAtRest> = true
_zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeys)
