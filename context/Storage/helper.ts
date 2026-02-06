import Big from 'big.js'

import { StatsFile, StatsFileAtRest } from '@/types'
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

export const getFiles = async (): Promise<StatsFile[]> => {
  const files: StatsFile[] = []

  await db.filesStore.iterate<StatsFileAtRest, void>((value) => {
    files.push(parseFileFromStorage(value))
  })

  return files
}

export const syncFileToStorage = (file: StatsFile): StatsFileAtRest => {
  if (!file.parsedContentRows) {
    return file as StatsFileAtRest
  }

  const updatedFile: StatsFileAtRest = {
    ...file,
    parsedContentRows: file.parsedContentRows.map((row) => {
      return { ...row, value: row.value.toString() }
    }),
  }
  return updatedFile
}

export const parseFileFromStorage = (file: StatsFileAtRest): StatsFile => {
  if (!file.parsedContentRows) {
    return file as StatsFile
  }

  const updatedFile: StatsFile = {
    ...file,
    parsedContentRows: file.parsedContentRows.map((row) => {
      return { ...row, value: Big(row.value) }
    }),
  }
  return updatedFile
}
