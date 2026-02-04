import localforage from 'localforage'

import { getLocalUserPreferences } from '@/utils/LocalStorage'

const SESSION_KEY = 'fstats-session'
const SELECTED_FILES_KEY = 'selected-files'
const FILES_PREFIX = 'file_'

const store = localforage.createInstance({
  name: 'fstats-db',
  storeName: 'fstats-store',
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  description: 'Private financial statement analyzer storage',
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
let initPromise: Promise<void> | null = null

const doInit = async () => {
  const { persistData } = getLocalUserPreferences()
  if (!persistData && !sessionStorage.getItem(SESSION_KEY)) {
    await clearAllFiles()
    await store.removeItem(SELECTED_FILES_KEY)
  }
  sessionStorage.setItem(SESSION_KEY, 'true')
}

export const initStorage = (): Promise<void> => {
  if (!initPromise) initPromise = doInit()
  return initPromise
}

// --- Files ---

export const storeFile = async (file: Omit<FileData, 'uploadedAt'> & { uploadedAt?: number }): Promise<void> => {
  await initStorage()
  const fileData: FileData = { ...file, uploadedAt: file.uploadedAt ?? Date.now() }
  await store.setItem(`${FILES_PREFIX}${file.id}`, fileData)
}

export const getAllFiles = async (): Promise<FileData[]> => {
  await initStorage()
  const keys = await store.keys()
  const files = await Promise.all(
    keys.filter((key) => key.startsWith(FILES_PREFIX)).map((key) => store.getItem<FileData>(key)),
  )
  return files.filter((f): f is FileData => f != null)
}

export const deleteFile = async (id: string): Promise<void> => {
  await initStorage()
  await store.removeItem(`${FILES_PREFIX}${id}`)
}

// NOTE: does not await initStorage — called during init itself
export const clearAllFiles = async (): Promise<void> => {
  const keys = await store.keys()
  await Promise.all(keys.filter((key) => key.startsWith(FILES_PREFIX)).map((key) => store.removeItem(key)))
}

// --- Selection ---

export const setSelectedFiles = async (fileIds: string[] | null): Promise<void> => {
  await initStorage()
  await store.setItem(SELECTED_FILES_KEY, fileIds)
}

export const getSelectedFiles = async (): Promise<string[] | null> => {
  await initStorage()
  return store.getItem<string[] | null>(SELECTED_FILES_KEY)
}
