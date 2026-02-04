import { parseCSVFile } from './csvParser'

export type ParserOptions = {
  onComplete: (data: unknown[]) => void
  onError: (error: Error) => void
}

export type ParserFn = (file: File, options: ParserOptions) => void

const PARSERS = {
  csv: parseCSVFile,
}

export type ParserType = keyof typeof PARSERS

export const getParser = (type: ParserType): ParserFn => PARSERS[type]
