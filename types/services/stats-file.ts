import { z } from 'zod'

import { zParserId, zStatsFileStatus } from '@/types-enums'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'
import { zPPRawParseResult } from '../lib/papaparse'
import { zRDZFileWithPath } from '../lib/react-dropzone'
import { zTransaction, zTransactionAtRest } from './transaction'

const zDefaultRawParseResult = z.object({
  type: z.string(),
  result: z.literal(null),
  success: z.boolean(),
  error: z.string().optional(),
})

export const zCsvParseResult = z.object({
  ...zDefaultRawParseResult.shape,
  type: z.literal('text/csv'),
  result: zPPRawParseResult.nullable(),
})

export type CsvParseResult = z.infer<typeof zCsvParseResult>

export const zPdfParseResult = z.object({
  ...zDefaultRawParseResult.shape,
  type: z.literal('application/pdf'),
  result: z.string().nullable(), // TODO: Add correct type
})

export type PdfParseResult = z.infer<typeof zPdfParseResult>

export const zRawParseResult = z.union([zCsvParseResult, zPdfParseResult, zDefaultRawParseResult])

export type RawParseResult = z.infer<typeof zRawParseResult>

export const zRowData = z.array(z.string())

export type RowData = z.infer<typeof zRowData>

export const zParsedDataResult = z.object({
  type: z.string(),
  data: z.array(zRowData),
  success: z.boolean(),
  error: z.string().optional(),
})

export type ParsedDataResult = z.infer<typeof zParsedDataResult>

export const zStatsFile = z.object({
  created: z.union([z.literal(''), zDateTimeString]),
  modified: z.union([z.literal(''), zDateTimeString]),
  id: z.union([z.literal(''), zIdString]),
  /**
   * This is a hash of all transactions, not the actual parse result.
   */
  // hash: z.union([z.literal(''), zNonEmptyString]),
  file: zRDZFileWithPath,
  status: zStatsFileStatus,
  parserId: zParserId.nullable(),
  parseResult: zRawParseResult.nullable(),
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
  // hash: zNonEmptyString,
  transactions: z.array(zTransactionAtRest),
})

export type StatsFileAtRest = z.infer<typeof zStatsFileAtRest>

// Safety checks
const assertKeys: _KeysCheck<StatsFile, StatsFileAtRest> = true
_zKeysCheck(zStatsFile, zStatsFileAtRest, assertKeys)
