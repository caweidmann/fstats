import localforage from 'localforage'

import { MISC } from '@/common'
import { getLocalUserPreferences } from '@/utils/LocalStorage'

const baseConfig = {
  name: 'fstats',
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
}

const filesStore = localforage.createInstance({
  ...baseConfig,
  storeName: 'fstats__files',
  description: 'Uploaded CSV files.',
})

export interface FileData {
  id: string
  name: string
  size: number
  lastModified: number
  data: unknown[]
  uploadedAt: number
  status: 'complete' | 'error'
  error?: string
}

let isInitialised: Promise<void> | null = null

const doInit = async () => {
  const { persistData } = getLocalUserPreferences()

  if (!persistData && !sessionStorage.getItem(MISC.SS_SESSION_KEY)) {
    await clearAllFiles()
    localStorage.removeItem(MISC.LS_SELECTED_FILE_IDS_KEY)
  }

  sessionStorage.setItem(MISC.SS_SESSION_KEY, 'true')
}

export const initStorage = (): Promise<void> => {
  if (!isInitialised) {
    isInitialised = doInit()
  }

  return isInitialised
}

export const storeFile = async (file: Omit<FileData, 'uploadedAt'>): Promise<void> => {
  await initStorage()
  await filesStore.setItem(file.id, { ...file, uploadedAt: Date.now() })
}

export const getAllFiles = async (): Promise<FileData[]> => {
  await initStorage()
  const files: FileData[] = []
  await filesStore.iterate<FileData, void>((value) => {
    files.push(value)
  })
  return files
}

export const deleteFile = async (id: string): Promise<void> => {
  await initStorage()
  await filesStore.removeItem(id)
}

export const clearAllFiles = async (): Promise<void> => {
  await filesStore.clear()
}
