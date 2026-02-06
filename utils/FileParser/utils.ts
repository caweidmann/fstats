import { parse } from 'papaparse'

import type { Parser, PPRawParseResult, StatsFile } from '@/types'
import { ParserId } from '@/types-enums'

import { getLocalUserPreferences } from '../LocalStorage'
import { AVAILABLE_PARSERS } from '../Parsers'

export const parseFiles = async (files: StatsFile[]): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map(parseFile))
  return parsedFiles
}

export const parseFile = async (file: StatsFile): Promise<StatsFile> => {
  const { locale } = getLocalUserPreferences()
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
    status: 'parsed',
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
