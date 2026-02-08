/**
 * Prefix all types with "PP" = papaparse
 */
import type { ParseResult as PPParseResult } from 'papaparse'
import { z } from 'zod'

export type PPDataRow = string[] // We use string[] because we use `header: false` in papaparse
export type PPRawParseResult = PPParseResult<PPDataRow>

export const zPPRawParseResult = z.custom<PPRawParseResult>()
