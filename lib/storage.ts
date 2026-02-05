import localforage from 'localforage'

import { FileData } from '@/types'
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

export const storeFile = async (file: FileData): Promise<void> => {
  await filesStore.setItem(file.id, file)
}

export const getAllFiles = async (): Promise<FileData[]> => {
  const files: FileData[] = []
  await filesStore.iterate<FileData, void>((value) => {
    files.push(value)
  })
  return files
}

export const deleteFile = async (id: string): Promise<void> => {
  await filesStore.removeItem(id)
}

export const clearAllFiles = async (): Promise<void> => {
  await filesStore.clear()
}
