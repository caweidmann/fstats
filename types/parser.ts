import { Currency, DateFormat, UserLocale } from '@/types-enums'

import type { IdString } from './global'
import type { PPRawParseResult } from './lib/papaparse'
import type { Transaction } from './services/transaction'

export type ColDef = Record<string, string>

export type RowAccessor<T extends ColDef> = {
  get: (key: keyof T) => string
}

export type RowValueGetter<T extends ColDef> = keyof T | ((row: RowAccessor<T>) => string)

export type CreateParserParams<T extends ColDef> = {
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: T
  dateFormat: string
  dateGetter: RowValueGetter<T>
  descriptionGetter: RowValueGetter<T>
  valueGetter: RowValueGetter<T>
}

export type ParserConfig = {
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: ColDef
  detect: (input: PPRawParseResult) => boolean
  parse: (input: PPRawParseResult, locale: UserLocale, dateFormat: DateFormat) => Transaction[]
}

export type Parser = ParserConfig & {
  id: IdString
}
