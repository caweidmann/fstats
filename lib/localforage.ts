import localforage from 'localforage'

const baseConfig = {
  name: 'fstats',
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
}

const filesStore = localforage.createInstance({
  ...baseConfig,
  storeName: 'fstats__files',
  description: 'Uploaded files store',
})

export const db = {
  filesStore,
}
