import type { ParseResult as PPParseResult } from 'papaparse'
import type { FileWithPath } from 'react-dropzone'

import { SupportedParsers } from '@/types-enums'

import { DateTimeString, NumberBig } from './global'

export type ParsedContentRow = {
  date: string
  description: string
  value: NumberBig
}

export type ParsedContentRowAtRest = {
  date: string
  description: string
  value: string
}

export type PPDataRow = string[] // we use string[] because we use `header: false` in papaparse, otherwise it would be object[]
export type PPRawParseResult = PPParseResult<PPDataRow>

export type StatsFile = {
  id: string
  file: FileWithPath
  uploaded: DateTimeString
  status: 'parsing' | 'parsed' | 'error'
  error?: string
  parsedType?: SupportedParsers
  rawParseResult?: PPRawParseResult
  parsedContentRows?: ParsedContentRow[]
}

export type StatsFileAtRest = Omit<StatsFile, 'parsedContentRows'> & {
  parsedContentRows?: ParsedContentRowAtRest[]
}
