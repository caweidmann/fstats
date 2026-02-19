import { zSyncableStatsFile } from '@/types'
import type { RawParseResult, StatsFile } from '@/types'
import { DateFormat, StatsFileStatus, UserLocale } from '@/types-enums'

import { getMatchingParser, getTransformedRawData, parseData, rawParseFile } from './helper'

export const parseFiles = async (
  files: StatsFile[],
  locale: UserLocale,
  dateFormat: DateFormat,
): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map((file) => parseFile(file, locale, dateFormat)))
  return parsedFiles
}

const _returnError = (
  file: StatsFile,
  parseResult: RawParseResult,
  parserId: StatsFile['parserId'],
  error: string | undefined,
): StatsFile => ({
  ...file,
  parseResult,
  parserId,
  status: StatsFileStatus.ERROR,
  error,
})

export const parseFile = async (file: StatsFile, locale: UserLocale, dateFormat: DateFormat): Promise<StatsFile> => {
  // 1. Parse the raw file (CSV, PDF, etc.)
  const parseResult = await rawParseFile(file.file)

  if (!parseResult.success) {
    return _returnError(file, parseResult, null, parseResult.error)
  }

  // 2. Transform the raw parse result to a unified format
  const parsedData = getTransformedRawData(parseResult)

  if (!parsedData.success) {
    return _returnError(file, parseResult, null, parsedData.error)
  }

  // 3. Find a matching parser
  const matchedParser = getMatchingParser(parsedData)

  if (!matchedParser) {
    return _returnError(file, parseResult, null, 'No matching parser found!')
  }

  // 4. Transform data to clean transactions
  const transactions = parseData(parsedData, matchedParser, locale, dateFormat)

  if (!transactions) {
    return _returnError(file, parseResult, matchedParser.id, `Parsing "${matchedParser.id}" failed!`)
  }

  // 5. Create StatsFile and check if it can be synced so consumers are working with valid data
  const parserId = matchedParser.id
  const result: StatsFile = {
    ...file,
    parseResult,
    parserId,
    transactions,
  }

  const res = zSyncableStatsFile.safeParse(result)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    console.error(`Validation failed for parser "${parserId}":`, errors)
    return _returnError(file, parseResult, parserId, `Validating "${parserId}" failed: ${errors}`)
  }

  // 6. Only once validation passes can we mark it as parsed
  return {
    ...result,
    status: StatsFileStatus.PARSED,
  }
}
