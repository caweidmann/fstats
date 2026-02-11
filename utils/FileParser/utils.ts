import { parse } from 'papaparse'

import type { Parser, PPRawParseResult, StatsFile } from '@/types'
import { StatsFileStatus, UserLocale } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/parsers'

export const parseFiles = async (files: StatsFile[], locale: UserLocale): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map((file) => parseFile(file, locale)))
  return parsedFiles
}

export const parseFile = async (file: StatsFile, locale: UserLocale): Promise<StatsFile> => {
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
      console.error(`Error detecting with ${parser.id}:`, err)
    }
  }

  if (matchedParser) {
    try {
      parserId = matchedParser.id
      parsedContentRows = matchedParser.parse(rawParseResult, locale)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error(`Parsing failed with ${matchedParser.id}: ${errorMessage}`)
    }
  }

  return {
    ...file,
    status: StatsFileStatus.PARSED,
    rawParseResult,
    parsedContentRows,
    parserId,
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
