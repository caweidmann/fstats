import { parse } from 'papaparse'

import type { Parser, PPRawParseResult, StatsFile } from '@/types'
import { SupportedParsers } from '@/types-enums'

import { getLocalUserPreferences } from '../LocalStorage'
import { CapitecParser } from '../Parsers'

const AVAILABLE_PARSERS: Parser[] = [
  // Order matters, more specific parsers first
  CapitecParser,
]

export const parseFiles = async (files: StatsFile[]): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map(parseFile))
  return parsedFiles
}

export const parseFile = async (file: StatsFile): Promise<StatsFile> => {
  const { locale } = getLocalUserPreferences()
  const rawParseResult = await parseRaw(file.file)

  let parsedType: StatsFile['parsedType'] = SupportedParsers.UNKNOWN
  let parsedContentRows: StatsFile['parsedContentRows'] = []

  let matchedParser: Parser | null = null

  for (const parser of AVAILABLE_PARSERS) {
    try {
      if (parser.detect(rawParseResult.data)) {
        matchedParser = parser
        break
      }
    } catch (err) {
      console.error(`Error detecting with ${parser.name}:`, err)
    }
  }

  if (matchedParser) {
    try {
      parsedType = matchedParser.format
      parsedContentRows = matchedParser.parse(rawParseResult, locale)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error(`Parsing failed with ${matchedParser.name}: ${errorMessage}`)
    }
  }

  return {
    ...file,
    status: 'parsed',
    rawParseResult,
    parsedContentRows,
    parsedType,
  }
}

export const parseRaw = async (file: File): Promise<PPRawParseResult> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: false,
      skipEmptyLines: true,
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
