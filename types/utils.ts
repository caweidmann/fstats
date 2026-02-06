import type { Locale } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'

import { ColorMode, SupportedParsers, UserLocale } from '@/types-enums'

import type { ParsedContentRow, PPRawParseResult, StatsFile } from './stats-file'

export type UserPreferences = {
  locale: UserLocale
  colorMode: ColorMode
  persistData: boolean
}

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
  id: SupportedParsers
  bankName: string
  accountType: string
  expectedHeaderRowIndex: number
  expectedHeaders: string[]
  detect: (input: PPRawParseResult) => boolean
  parse: (input: PPRawParseResult, locale: UserLocale) => ParsedContentRow[]
}
