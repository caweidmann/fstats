import { parse } from 'papaparse'

import type { ParsedDataResult, Parser, PPRawParseResult, RawParseResult, RDZFileWithPath, Transaction } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/utils/Parser'

export const parseCsv = async (file: RDZFileWithPath): Promise<PPRawParseResult> => {
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

export const parsePdf = async (file: RDZFileWithPath): Promise<string> => {
  // TODO: Implement PDF parsing, perhaps using
  return new Promise((resolve) => {
    resolve(file.name)
  })
}

export const rawParseFile = async (file: RDZFileWithPath): Promise<RawParseResult> => {
  switch (file.type) {
    case 'text/csv': {
      try {
        const result = await parseCsv(file)
        return { type: file.type, result, success: true }
      } catch (err) {
        return {
          type: file.type,
          result: null,
          success: false,
          error: `Parsing "${file.type}" failed: ${err instanceof Error ? err.message : String(err)}`,
        }
      }
    }

    case 'application/pdf': {
      try {
        const result = await parsePdf(file)
        return { type: file.type, result, success: true }
      } catch (err) {
        return {
          type: file.type,
          result: null,
          success: false,
          error: `Parsing "${file.type}" failed: ${err instanceof Error ? err.message : String(err)}`,
        }
      }
    }

    default:
      return {
        type: file.type,
        result: null,
        success: false,
        error: `Parsing "${file.type}" failed: Unsupported file type.`,
      }
  }
}

export const getTransformedRawData = (rawData: RawParseResult): ParsedDataResult => {
  switch (rawData.type) {
    case 'text/csv':
      if (!rawData.result) {
        return {
          type: rawData.type,
          data: [],
          success: false,
          error: 'No result from CSV parse',
        }
      }
      return {
        type: rawData.type,
        data: rawData.result.data,
        success: true,
      }
    case 'application/pdf':
      if (!rawData.result) {
        return {
          type: rawData.type,
          data: [],
          success: false,
          error: 'No result from PDF parse',
        }
      }
      return {
        type: rawData.type,
        data: [[rawData.result]], // TODO: Add correct data transformation
        success: true,
      }
    default:
      return {
        type: rawData.type,
        data: [],
        success: false,
        error: `Unsupported file type: ${rawData.type}`,
      }
  }
}

export const getMatchingParser = (parsedData: ParsedDataResult): Parser | null => {
  for (const parser of Object.values(AVAILABLE_PARSERS)) {
    try {
      if (parser.detect(parsedData)) {
        return parser
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`Error detecting with ${parser.id}:`, errMsg)
    }
  }

  return null
}

export const parseData = (
  parsedData: ParsedDataResult,
  parser: Parser,
  locale: UserLocale,
  dateFormat: DateFormat,
): Transaction[] | null => {
  try {
    return parser.parse(parsedData, locale, dateFormat)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error(`Parsing failed with ${parser.id}:`, errMsg)
    return null
  }
}
