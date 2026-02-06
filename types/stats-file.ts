import type { ParseResult } from 'papaparse'
import type { FileWithPath } from 'react-dropzone'

import { SupportedFormats } from '@/types-enums'

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

export type StatsFile = {
  id: string
  file: FileWithPath
  uploaded: DateTimeString
  status: 'parsing' | 'parsed' | 'error'
  error?: string
  parsedType?: SupportedFormats
  rawParseResult?: ParseResult<any>
  parsedContentRows?: ParsedContentRow[]
}

export type StatsFileAtRest = Omit<StatsFile, 'parsedContentRows'> & {
  parsedContentRows?: ParsedContentRowAtRest[]
}
