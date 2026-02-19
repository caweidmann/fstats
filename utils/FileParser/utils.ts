import { zSyncableStatsFile } from '@/types'
import type { Parser, StatsFile, Transaction } from '@/types'
import { DateFormat, StatsFileStatus, UserLocale } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/parsers'

import { parseCsv } from './helper'

export const parseFiles = async (
  files: StatsFile[],
  locale: UserLocale,
  dateFormat: DateFormat,
): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map((file) => parseFile(file, locale, dateFormat)))
  return parsedFiles
}

export const parseFile = async (file: StatsFile, locale: UserLocale, dateFormat: DateFormat): Promise<StatsFile> => {
  const parseResult = await parseCsv(file.file)
  let parserId: StatsFile['parserId'] = null
  let transactions: Transaction[] = []
  let matchedParser: Parser | null = null

  for (const parser of Object.values(AVAILABLE_PARSERS)) {
    try {
      if (parser.detect(parseResult)) {
        matchedParser = parser
        break
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`Error detecting with ${parser.id}:`, errMsg)
      return {
        ...file,
        parseResult,
        transactions,
        parserId,
        status: StatsFileStatus.ERROR,
        error: `Parse "${parser.id}" failed during detection phase`,
      }
    }
  }

  if (matchedParser) {
    try {
      parserId = matchedParser.id as StatsFile['parserId']
      transactions = matchedParser.parse(parseResult, locale, dateFormat)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`Parsing failed with ${matchedParser.id}:`, errMsg)
      return {
        ...file,
        parseResult,
        transactions,
        parserId,
        status: StatsFileStatus.ERROR,
        error: `Parse "${matchedParser.id}" failed`,
      }
    }
  }

  const dataToSync: StatsFile = {
    ...file,
    parseResult,
    transactions,
    parserId,
  }

  const res = zSyncableStatsFile.safeParse(dataToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    console.error(`Validation failed for parser "${parserId}":`, errors)
    return {
      ...file,
      parseResult,
      parserId,
      status: StatsFileStatus.ERROR,
      error: `Parse "${parserId}" failed during validation`,
    }
  }

  return {
    ...dataToSync,
    status: StatsFileStatus.PARSED,
  }
}
