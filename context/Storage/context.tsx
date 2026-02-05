'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { FileData, StorageContextState } from '@/types'
import { db } from '@/lib/localforage'

import { getAllFiles, initStorage } from './helper'

const StorageContext = createContext<StorageContextState | null>(null)

type StorageContextProviderProps = {
  children: ReactNode
}

export const StorageProvider = ({ children }: StorageContextProviderProps) => {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initStorage()
      const storedFiles = await getAllFiles()
      setFiles(storedFiles)
      setIsLoading(false)
    }
    init()
  }, [])

  const storeFile = useCallback(async (file: Omit<FileData, 'uploadedAt'>) => {
    const newFile: FileData = {
      ...file,
      uploadedAt: Date.now(),
    }

    await db.filesStore.setItem(newFile.id, newFile)

    setFiles((prev) => {
      const idx = prev.findIndex((ifile) => ifile.id === file.id)
      return idx >= 0 ? prev.map((ifile) => (ifile.id === file.id ? newFile : ifile)) : [...prev, newFile]
    })
  }, [])

  const deleteFile = useCallback(async (id: string) => {
    await db.filesStore.removeItem(id)
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const deleteAllFiles = useCallback(async () => {
    await db.filesStore.clear()
    setFiles([])
  }, [])

  const value = useMemo(() => {
    return {
      isLoading,
      files,
      storeFile,
      deleteFile,
      deleteAllFiles,
    }
  }, [isLoading, files, storeFile, deleteFile, deleteAllFiles])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('Please ensure to wrap your component in a "StorageProvider"!')
  }
  return context
}
