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

// --- Init — runs once, result is cached ---
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

// --- Files ---

export const storeFile = async (file: Omit<FileData, 'uploadedAt'> & { uploadedAt?: number }): Promise<void> => {
  await initStorage()
  const fileData: FileData = { ...file, uploadedAt: file.uploadedAt ?? Date.now() }
  await filesStore.setItem(file.id, fileData)
}

export const getAllFiles = async (): Promise<FileData[]> => {
  await initStorage()
  const keys = await filesStore.keys()
  const files = await Promise.all(keys.map((key) => filesStore.getItem<FileData>(key)))
  return files.filter((f): f is FileData => f != null)
}

export const deleteFile = async (id: string): Promise<void> => {
  await initStorage()
  await filesStore.removeItem(id)
}

// NOTE: does not await initStorage — called during init itself
export const clearAllFiles = async (): Promise<void> => {
  await filesStore.clear()
}
