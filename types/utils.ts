import type { Locale } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'

import { ParserId, UserLocale } from '@/types-enums'

import type { SelectOptionWithType } from './global'
import type { PPRawParseResult } from './lib/papaparse'
import type { ParsedContentRow } from './services/parsed-content-row'
import type { StatsFile } from './services/stats-file'

// TODO: Double check this logic
export type StorageContextState = {
  isLoading: boolean
  files: StatsFile[]
  selectedFileIds: string[]
  setSelectedFileIds: Dispatch<SetStateAction<string[]>>
  addFiles: (files: StatsFile[]) => Promise<void>
  updateFile: (id: string, updates: Partial<StatsFile>) => Promise<void>
  removeFiles: (ids: string[]) => Promise<void>
  removeAllFiles: () => Promise<void>
}

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
