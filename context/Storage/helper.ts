import { FileData } from '@/types'
import { MISC } from '@/common'
import { getLocalUserPreferences } from '@/utils/LocalStorage'
import { db } from '@/lib/localforage'

export const initStorage = async () => {
  const { persistData } = getLocalUserPreferences()

  if (!persistData && !sessionStorage.getItem(MISC.SS_SESSION_KEY)) {
    await db.filesStore.clear()
    localStorage.removeItem(MISC.LS_SELECTED_FILE_IDS_KEY)
  }

  sessionStorage.setItem(MISC.SS_SESSION_KEY, 'true')
}

export const getFiles = async (): Promise<FileData[]> => {
  const files: FileData[] = []

  await db.filesStore.iterate<FileData, void>((value) => {
    files.push(value)
  })

  return files
}
