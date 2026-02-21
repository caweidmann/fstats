import type { Locale } from 'date-fns'

import { BankAccountId, Currency } from '@/types-enums'

import type { NumberString, SelectOptionWithType } from './global'

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>

export type Size = {
  width?: number
  height?: number
}

export type SelectOptionBankAccountId = BankAccountId | 'all' | ''

export type BankSelectOption = SelectOptionWithType<SelectOptionBankAccountId>

export type StatsPageForm = {
  selectedId: BankSelectOption['value']
}

/**
 * The currency format to use when formatting a currency, iso refers to "ISO 4217".
 */
export type CurrencyFormat = 'iso' | 'symbol'

export type FixedLocaleAppendOption =
  | string
  | {
      currency: Currency
      format?: CurrencyFormat
    }
  | null

export type FixedLocaleOptions = {
  trimTrailingZeros?: boolean
  append?: FixedLocaleAppendOption
  prepend?: FixedLocaleAppendOption
}

export type FixedLocaleCurrencyOptions = {
  rawValue?: NumberString
  isFractional?: boolean
  currencyFormat?: CurrencyFormat
  trimTrailingZeros?: boolean
}
