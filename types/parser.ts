import type { BankAccountId } from '@/types-enums'
import { Currency, DateFormat, ParserId, UserLocale } from '@/types-enums'

import { ParsedDataResult } from './services/stats-file'
import type { Transaction } from './services/transaction'

export type ColDef = Record<string, string>

export type RowAccessor<T extends ColDef> = {
  get: (key: keyof T) => string
}

export type Getter<T extends ColDef> = (row: RowAccessor<T>) => string

export type ExtraGetter<T extends ColDef> = (row: RowAccessor<T>) => Transaction['extra']

export type ParserGetters<T extends ColDef> = {
  date: Getter<T>
  description: Getter<T>
  value: Getter<T>
  extra?: ExtraGetter<T>
}

export type CreateParserParams<T extends ColDef, Id extends ParserId = ParserId> = {
  id: Id
  bankAccountId: BankAccountId
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: T
  dateFormat: string
  getters: ParserGetters<T>
}

export type Parser<Id extends ParserId = ParserId> = {
  id: Id
  bankAccountId: BankAccountId
  bankName: string
  accountType: string
  currency: Currency
  headerRowIndex: number
  columns: ColDef
  dateFormat: string
  detect: (input: ParsedDataResult) => boolean
  parse: (input: ParsedDataResult, locale: UserLocale, dateFormat: DateFormat) => Transaction[]
}
