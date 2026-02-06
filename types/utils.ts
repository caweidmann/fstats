import type { Locale } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'
import type { FileWithPath } from 'react-dropzone'

import { ColorMode, SupportedFormats, UserLocale } from '@/types-enums'

import { DateTimeString } from './global'

export type UserPreferences = {
  locale: UserLocale
  colorMode: ColorMode
  persistData: boolean
}

export type FileData = {
  id: string
  file: FileWithPath
  uploaded: DateTimeString
  status: 'parsing' | 'parsed' | 'error'
  error?: string
  parsedContent?: unknown
  parsedType?: SupportedFormats
}

export type StorageContextState = {
  isLoading: boolean
  files: FileData[]
  selectedFileIds: string[]
  setSelectedFileIds: Dispatch<SetStateAction<string[]>>
  addFiles: (files: FileData[]) => Promise<void>
  updateFile: (id: string, updates: Partial<FileData>) => Promise<void>
  removeFile: (id: string) => Promise<void>
  removeAllFiles: () => Promise<void>
}

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>
