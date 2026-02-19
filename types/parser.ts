import { Currency, DateFormat, UserLocale } from '@/types-enums'
import { ParserId } from '@/parsers'

import { ParsedDataResult } from './services/stats-file'
import type { Transaction } from './services/transaction'

export type ColDef = Record<string, string>

export type RowAccessor<T extends ColDef> = {
  get: (key: keyof T) => string
}

export type RowValueGetter<T extends ColDef> = keyof T | ((row: RowAccessor<T>) => string)

export type ParserGetters<T extends ColDef> = {
  date: RowValueGetter<T>
  description: RowValueGetter<T>
  value: RowValueGetter<T>
}

export type CreateParserParams<T extends ColDef> = {
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: T
  dateFormat: string
  getters: ParserGetters<T>
}

export type ParserConfig = {
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: ColDef
  dateFormat: string
  detect: (input: ParsedDataResult) => boolean
  parse: (input: ParsedDataResult, locale: UserLocale, dateFormat: DateFormat) => Transaction[]
}

export type Parser = ParserConfig & {
  id: ParserId
}
