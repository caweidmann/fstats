import type { Locale } from 'date-fns'

import { ParserId, UserLocale } from '@/types-enums'

import type { SelectOptionWithType } from './global'
import type { PPRawParseResult } from './lib/papaparse'
import type { ParsedContentRow } from './services/parsed-content-row'

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>

export type Parser = {
  id: ParserId
  bankName: string
  accountType: string
  expectedHeaderRowIndex: number
  expectedHeaders: string[]
  detect: (input: PPRawParseResult) => boolean
  parse: (input: PPRawParseResult, locale: UserLocale) => ParsedContentRow[]
}

export type BankSelectOption = SelectOptionWithType<ParserId | 'all' | 'unknown'>
