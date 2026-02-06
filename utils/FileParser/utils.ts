import { parse } from 'papaparse'

import type { StatsFile } from '@/types'
import { SupportedFormats } from '@/types-enums'

import { getLocalUserPreferences } from '../LocalStorage'
import { isEqual } from '../Misc'
import { CapitecParser } from '../Parsers'

export const parseFiles = async (files: StatsFile[]): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map(parseFile))
  return parsedFiles
}

export const parseFile = async (file: StatsFile): Promise<StatsFile> => {
  const { locale } = getLocalUserPreferences()
  let parsedType: StatsFile['parsedType'] = SupportedFormats.UNKNOWN
  let parsedContentRows: StatsFile['parsedContentRows']
  const rawParseResult = await parseRaw(file.file)

  if (isEqual(rawParseResult.data[0], CapitecParser.headers)) {
    parsedType = SupportedFormats.CAPITEC
    parsedContentRows = CapitecParser.parse(rawParseResult, locale)
  }

  return {
    ...file,
    status: 'parsed',
    rawParseResult,
    parsedContentRows,
    parsedType,
  }
}

export const parseRaw = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      // header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        resolve(results)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
