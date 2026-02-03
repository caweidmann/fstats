import localforage from 'localforage'

const PERSIST_KEY = 'persist-data'
const SELECTED_FILES_KEY = 'selected-files'
const FILES_PREFIX = 'file_'

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

class StorageService {
  private store: LocalForage
  private initialized = false
  private initPromise: Promise<void> | null = null

  constructor() {
    this.store = localforage.createInstance({
      name: 'fstats-db',
      storeName: 'fstats-store',
      driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
      description: 'Private financial statement analyzer storage',
    })
  }

  async init(): Promise<void> {
    if (this.initialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = this._doInit()
    return this.initPromise
  }

  private async _doInit(): Promise<void> {
    if (!this.getPersistSetting()) {
      await this.clearAllFiles()
    }
    this.initialized = true
  }

  getPersistSetting(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem(PERSIST_KEY) === 'true'
  }

  setPersistSetting(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERSIST_KEY, String(enabled))
    }
  }

  async storeFile(
    id: string,
    name: string,
    size: number,
    lastModified: number,
    data: unknown[],
    status: 'complete' | 'error' = 'complete',
    error?: string,
  ): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    const fileData: FileData = {
      id,
      name,
      size,
      lastModified,
      data,
      uploadedAt: Date.now(),
      status,
      error,
    }

    await this.store.setItem(`${FILES_PREFIX}${id}`, fileData)
  }

  async getAllFiles(): Promise<FileData[]> {
    if (!this.initialized) {
      await this.init()
    }

    try {
      const keys = await this.store.keys()
      const fileKeys = keys.filter((key) => key.startsWith(FILES_PREFIX))

      const files: FileData[] = []
      for (const fileKey of fileKeys) {
        const fileData = await this.store.getItem<FileData>(fileKey)
        if (fileData) {
          files.push(fileData)
        }
      }

      return files
    } catch (error) {
      console.error('Failed to get all files:', error)
      return []
    }
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    await this.store.removeItem(`${FILES_PREFIX}${id}`)
  }

  async clearAllFiles(): Promise<void> {
    const keys = await this.store.keys()
    const fileKeys = keys.filter((key) => key.startsWith(FILES_PREFIX))

    await Promise.all(fileKeys.map((key) => this.store.removeItem(key)))
  }

  async setSelectedFiles(fileIds: string[] | null): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }
    await this.store.setItem(SELECTED_FILES_KEY, fileIds)
  }

  async getSelectedFiles(): Promise<string[] | null> {
    if (!this.initialized) {
      await this.init()
    }
    return this.store.getItem<string[] | null>(SELECTED_FILES_KEY)
  }
}

export const indexedDBService = new StorageService()
