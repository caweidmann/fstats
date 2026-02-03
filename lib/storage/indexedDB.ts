import localforage from 'localforage'

const SESSION_KEY = 'current-session-id'
const PERSIST_KEY = 'persist-data'
const PERSIST_SETTING_KEY = 'persist-setting'
const SELECTED_FILES_KEY = 'selected-files'
const FILES_PREFIX = 'file_'
const SESSION_PREFIX = 'session_'

export interface FileData {
  id: string
  sessionId: string
  name: string
  size: number
  lastModified: number
  data: unknown[]
  uploadedAt: number
  status: 'complete' | 'error'
  error?: string
}

export interface SessionData {
  id: string
  createdAt: number
  lastActive: number
}

class StorageService {
  private sessionId: string | null = null
  private store: LocalForage
  private initialized = false
  private initPromise: Promise<void> | null = null
  private cleanupHandlersSetup = false

  constructor() {
    this.store = localforage.createInstance({
      name: 'fstats-db',
      storeName: 'fstats-store',
      driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
      description: 'Private financial statement analyzer storage',
    })
  }

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    if (this.initialized) {
      const storedSessionId = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null
      if (storedSessionId && this.sessionId !== storedSessionId) {
        this.sessionId = storedSessionId
      }
      return
    }

    this.initPromise = this._doInit()
    return this.initPromise
  }

  private async _doInit(): Promise<void> {
    const persistEnabled = typeof window !== 'undefined' && localStorage.getItem(PERSIST_KEY) === 'true'

    const isRefresh =
      typeof window !== 'undefined' &&
      window.performance &&
      window.performance.getEntriesByType &&
      window.performance.getEntriesByType('navigation').length > 0 &&
      (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload'

    this.sessionId = sessionStorage.getItem(SESSION_KEY)

    if (persistEnabled && !this.sessionId) {
      this.sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_KEY, this.sessionId)
    } else if (!persistEnabled) {
      if (!this.sessionId || isRefresh) {
        this.sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
        sessionStorage.setItem(SESSION_KEY, this.sessionId)

        if (isRefresh) {
          await this.clearAllFiles()
        }
      }
    }

    await this.cleanupOldSessions()
    await this.registerSession()
    this.setupCleanupHandlers()
    this.initialized = true
  }

  private async registerSession(): Promise<void> {
    if (!this.sessionId) return

    const sessionData: SessionData = {
      id: this.sessionId,
      createdAt: Date.now(),
      lastActive: Date.now(),
    }

    await this.store.setItem(`${SESSION_PREFIX}${this.sessionId}`, sessionData)
  }

  private async cleanupOldSessions(): Promise<void> {
    try {
      const now = Date.now()
      const persistEnabled = typeof window !== 'undefined' && localStorage.getItem(PERSIST_KEY) === 'true'

      const ACTIVE_THRESHOLD = persistEnabled ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000

      const keys = await this.store.keys()
      const sessionKeys = keys.filter((key) => key.startsWith(SESSION_PREFIX))

      for (const sessionKey of sessionKeys) {
        const session = await this.store.getItem<SessionData>(sessionKey)

        if (session) {
          if (session.id === this.sessionId) continue

          if (now - session.lastActive > ACTIVE_THRESHOLD) {
            await this.deleteFilesBySession(session.id)
            await this.store.removeItem(sessionKey)
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error)
    }
  }

  private async deleteFilesBySession(sessionId: string): Promise<void> {
    try {
      const keys = await this.store.keys()
      const fileKeys = keys.filter((key) => key.startsWith(FILES_PREFIX))

      for (const fileKey of fileKeys) {
        const fileData = await this.store.getItem<FileData>(fileKey)
        if (fileData && fileData.sessionId === sessionId) {
          await this.store.removeItem(fileKey)
        }
      }
    } catch (error) {
      console.error('Failed to delete files by session:', error)
    }
  }

  private setupCleanupHandlers(): void {
    if (this.cleanupHandlersSetup) return
    this.cleanupHandlersSetup = true

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSessionActivity()
      }
    })

    setInterval(() => {
      this.updateSessionActivity()
    }, 30000)
  }

  private updateSessionActivity(): void {
    if (!this.sessionId) return

    this.store
      .getItem<SessionData>(`${SESSION_PREFIX}${this.sessionId}`)
      .then((session) => {
        if (session) {
          session.lastActive = Date.now()
          return this.store.setItem(`${SESSION_PREFIX}${this.sessionId}`, session)
        }
      })
      .catch((error) => {
        console.error('Failed to update session activity:', error)
      })
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

    if (!this.sessionId) {
      const storedSessionId = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null
      if (storedSessionId) {
        this.sessionId = storedSessionId
      } else {
        throw new Error('Storage not initialized - no session ID available')
      }
    }

    const fileData: FileData = {
      id,
      sessionId: this.sessionId,
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

  async getFile(id: string): Promise<FileData | null> {
    if (!this.initialized) {
      await this.init()
    }

    return this.store.getItem<FileData>(`${FILES_PREFIX}${id}`)
  }

  async getAllFiles(): Promise<FileData[]> {
    if (!this.initialized) {
      await this.init()
    }

    if (!this.sessionId) {
      const storedSessionId = typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null
      if (storedSessionId) {
        this.sessionId = storedSessionId
      } else {
        console.error('No session ID available')
        return []
      }
    }

    try {
      const keys = await this.store.keys()
      const fileKeys = keys.filter((key) => key.startsWith(FILES_PREFIX))

      const files: FileData[] = []
      for (const fileKey of fileKeys) {
        const fileData = await this.store.getItem<FileData>(fileKey)
        if (fileData && fileData.sessionId === this.sessionId) {
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
    if (!this.sessionId) return

    await this.deleteFilesBySession(this.sessionId)
  }

  async cleanup(): Promise<void> {
    if (!this.sessionId) return

    try {
      await this.clearAllFiles()
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Failed to cleanup session:', error)
    }
  }

  async clearAll(): Promise<void> {
    await this.store.clear()
    sessionStorage.removeItem(SESSION_KEY)
  }

  async getPersistSetting(): Promise<boolean> {
    try {
      const setting = await this.store.getItem<boolean>(PERSIST_SETTING_KEY)
      return setting === true
    } catch (error) {
      console.error('Failed to get persist setting:', error)
      return false
    }
  }

  async setPersistSetting(enabled: boolean): Promise<void> {
    try {
      await this.store.setItem(PERSIST_SETTING_KEY, enabled)
      if (typeof window !== 'undefined') {
        localStorage.setItem(PERSIST_KEY, String(enabled))
      }
    } catch (error) {
      console.error('Failed to set persist setting:', error)
      throw error
    }
  }

  async getStats(): Promise<{ fileCount: number; sessionCount: number }> {
    try {
      const keys = await this.store.keys()
      const fileCount = keys.filter((key) => key.startsWith(FILES_PREFIX)).length
      const sessionCount = keys.filter((key) => key.startsWith(SESSION_PREFIX)).length

      return { fileCount, sessionCount }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return { fileCount: 0, sessionCount: 0 }
    }
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
export const storageService = indexedDBService
