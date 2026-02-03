/**
 * Storage Service using LocalForage
 *
 * Provides persistent storage with session-based cleanup.
 * Data is automatically cleared when the tab is closed or refreshed.
 */

import localforage from 'localforage'

const SESSION_KEY = 'current-session-id'
const FILES_PREFIX = 'file_'
const SESSION_PREFIX = 'session_'

export interface FileData {
  id: string
  sessionId: string
  name: string
  size: number
  data: unknown[]
  uploadedAt: number
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

  constructor() {
    // Configure localForage to use IndexedDB
    this.store = localforage.createInstance({
      name: 'fstats-db',
      storeName: 'fstats-store',
      driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
      description: 'Private financial statement analyzer storage',
    })
  }

  /**
   * Initialize the storage and session
   */
  async init(): Promise<void> {
    if (this.initialized) return

    // Get or create session ID
    this.sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!this.sessionId) {
      this.sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_KEY, this.sessionId)
    }

    // Clean up old sessions
    await this.cleanupOldSessions()

    // Register current session
    await this.registerSession()

    // Set up cleanup handlers
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
      const ACTIVE_THRESHOLD = 5000 // 5 seconds

      // Get all keys
      const keys = await this.store.keys()

      // Find session keys
      const sessionKeys = keys.filter((key) => key.startsWith(SESSION_PREFIX))

      for (const sessionKey of sessionKeys) {
        const session = await this.store.getItem<SessionData>(sessionKey)

        if (session) {
          // Skip current session
          if (session.id === this.sessionId) continue

          // Clean up old sessions
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
    // Clean up when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.cleanup()
    })

    // Update activity when visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSessionActivity()
      }
    })

    // Update activity periodically
    setInterval(() => {
      this.updateSessionActivity()
    }, 3000)
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

  /**
   * Store file data
   */
  async storeFile(id: string, name: string, size: number, data: unknown[]): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    if (!this.sessionId) {
      throw new Error('Storage not initialized')
    }

    const fileData: FileData = {
      id,
      sessionId: this.sessionId,
      name,
      size,
      data,
      uploadedAt: Date.now(),
    }

    await this.store.setItem(`${FILES_PREFIX}${id}`, fileData)
  }

  /**
   * Get file data by ID
   */
  async getFile(id: string): Promise<FileData | null> {
    if (!this.initialized) {
      await this.init()
    }

    return this.store.getItem<FileData>(`${FILES_PREFIX}${id}`)
  }

  /**
   * Get all files for current session
   */
  async getAllFiles(): Promise<FileData[]> {
    if (!this.initialized) {
      await this.init()
    }

    if (!this.sessionId) {
      throw new Error('Storage not initialized')
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

  /**
   * Delete a file
   */
  async deleteFile(id: string): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    await this.store.removeItem(`${FILES_PREFIX}${id}`)
  }

  /**
   * Clear all files for current session
   */
  async clearAllFiles(): Promise<void> {
    if (!this.sessionId) return

    await this.deleteFilesBySession(this.sessionId)
  }

  /**
   * Clean up current session (called on page unload)
   */
  cleanup(): void {
    if (!this.sessionId) return

    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Failed to cleanup session:', error)
    }
  }

  /**
   * Completely clear all storage (useful for debugging or reset)
   */
  async clearAll(): Promise<void> {
    await this.store.clear()
    sessionStorage.removeItem(SESSION_KEY)
  }

  /**
   * Get storage statistics
   */
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
}

// Export singleton instance
export const indexedDBService = new StorageService()

// For backward compatibility
export const storageService = indexedDBService
