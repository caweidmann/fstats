import { Currency, DateFormat, ParserId, UserLocale } from '@/types-enums'

import type { PPRawParseResult } from './lib/papaparse'
import type { Transaction } from './services/transaction'

export type ColDef = Record<string, string>

export type RowAccessor<T extends ColDef> = {
  get: (key: keyof T) => string
}

export type CreateParserParams<T extends ColDef> = {
  id: ParserId
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: T
  dateFormat: string
  dateGetter: (row: RowAccessor<T>) => string
  descriptionGetter: (row: RowAccessor<T>) => string
  valueGetter: (row: RowAccessor<T>) => string
}

export type Parser = {
  id: ParserId
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: ColDef
  detect: (input: PPRawParseResult) => boolean
  parse: (input: PPRawParseResult, locale: UserLocale, dateFormat: DateFormat) => Transaction[]
}
