'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { FileData } from '@/types'
import {
  clearAllFiles as _clearAllFiles,
  deleteFile as _deleteFile,
  getAllFiles,
  initStorage,
  storeFile as _storeFile,
} from '@/lib/storage'

type StorageContextValue = {
  files: FileData[]
  storeFile: (file: Omit<FileData, 'uploadedAt'>) => Promise<void>
  deleteFile: (id: string) => Promise<void>
  clearAllFiles: () => Promise<void>
}

const StorageContext = createContext<StorageContextValue | null>(null)

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) throw new Error('useStorage must be used within a StorageProvider')
  return context
}

const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const load = async () => {
      await initStorage()
      setFiles(await getAllFiles())
      setIsReady(true)
    }
    load()
  }, [])

  const storeFile = useCallback(async (file: Omit<FileData, 'uploadedAt'>) => {
    const entry: FileData = { ...file, uploadedAt: Date.now() }
    await _storeFile(entry)
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === file.id)
      return idx >= 0 ? prev.map((f) => (f.id === file.id ? entry : f)) : [...prev, entry]
    })
  }, [])

  const deleteFile = useCallback(async (id: string) => {
    await _deleteFile(id)
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearAllFiles = useCallback(async () => {
    await _clearAllFiles()
    setFiles([])
  }, [])

  const value = useMemo(
    () => ({ files, storeFile, deleteFile, clearAllFiles }),
    [files, storeFile, deleteFile, clearAllFiles],
  )

  if (!isReady) return null

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export default StorageProvider
