import { parse } from 'papaparse'

import { zSyncableStatsFile, type Parser, type PPRawParseResult, type StatsFile } from '@/types'
import { DateFormat, StatsFileStatus, UserLocale } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/parsers'

export const parseFiles = async (
  files: StatsFile[],
  locale: UserLocale,
  dateFormat: DateFormat,
): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map((file) => parseFile(file, locale, dateFormat)))
  return parsedFiles
}

export const parseFile = async (file: StatsFile, locale: UserLocale, dateFormat: DateFormat): Promise<StatsFile> => {
  const rawParseResult = await parseRaw(file.file)
  let parserId: StatsFile['parserId'] = null
  let parsedContentRows: StatsFile['parsedContentRows'] = []
  let matchedParser: Parser | null = null

  for (const parser of Object.values(AVAILABLE_PARSERS)) {
    try {
      if (parser.detect(rawParseResult)) {
        matchedParser = parser
        break
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`Error detecting with ${parser.id}:`, errMsg)
      return {
        ...file,
        rawParseResult,
        parsedContentRows,
        parserId,
        status: StatsFileStatus.ERROR,
        error: `Parse "${parser.id}" failed during detection phase`,
      }
    }
  }

  if (matchedParser) {
    try {
      parserId = matchedParser.id
      parsedContentRows = matchedParser.parse(rawParseResult, locale, dateFormat)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`Parsing failed with ${matchedParser.id}:`, errMsg)
      return {
        ...file,
        rawParseResult,
        parsedContentRows,
        parserId,
        status: StatsFileStatus.ERROR,
        error: `Parse "${matchedParser.id}" failed`,
      }
    }
  }

  const dataToSync: StatsFile = {
    ...file,
    rawParseResult,
    parsedContentRows,
    parserId,
  }

  const res = zSyncableStatsFile.safeParse(dataToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    console.error(`Validation failed for parser "${parserId}":`, errors)
    return {
      ...file,
      rawParseResult,
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

export const parseRaw = async (file: File): Promise<PPRawParseResult> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: false,
      skipEmptyLines: 'greedy',
      encoding: 'utf-8',
      worker: true,
      complete: (results) => {
        resolve(results as PPRawParseResult)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
