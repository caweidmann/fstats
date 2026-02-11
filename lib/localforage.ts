import localforage from 'localforage'

import { MISC } from '@/common'
import { ensureUserExists } from '@/m-user/service'

const baseConfig = {
  name: 'fstats',
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
}

let filesStore: LocalForage | null = null
let userStore: LocalForage | null = null

export const initStorage = async () => {
  if (filesStore) {
    return
  }

  filesStore = localforage.createInstance({
    ...baseConfig,
    storeName: 'fstats__files',
    description: 'Uploaded files store',
  })

  userStore = localforage.createInstance({
    ...baseConfig,
    storeName: 'fstats__user',
    description: 'User store',
  })

  const user = await ensureUserExists()

  if (!user.persistData && !sessionStorage.getItem(MISC.SS_SESSION_KEY)) {
    await db.filesStore.clear()
    localStorage.removeItem(MISC.LS_SELECTED_FILE_IDS_KEY)
  }

  sessionStorage.setItem(MISC.SS_SESSION_KEY, 'true')
}

export const db = {
  get filesStore() {
    if (!filesStore) {
      throw new Error('DB not initialised! Call initStorage() first.')
    }
    return filesStore
  },
  get userStore() {
    if (!userStore) {
      throw new Error('DB not initialised! Call initStorage() first.')
    }
    return userStore
  },
}
