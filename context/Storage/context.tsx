'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { FileData, StorageContextState } from '@/types'
import { db } from '@/lib/localforage'

import { getFiles, initStorage } from './helper'

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
      const storedFiles = await getFiles()
      setFiles(storedFiles)
      setIsLoading(false)
    }
    init()
  }, [])

  const addFiles = useCallback(async (filesToAdd: FileData[]) => {
    for (const newFile of filesToAdd) {
      await db.filesStore.setItem(newFile.id, newFile)
    }
    setFiles((prev) => [...prev, ...filesToAdd])
    // const modified = formatISO(new Date())
  }, [])

  const removeFile = useCallback(async (id: string) => {
    await db.filesStore.removeItem(id)
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }, [])

  const removeAllFiles = useCallback(async () => {
    await db.filesStore.clear()
    setFiles([])
  }, [])

  const value = useMemo(() => {
    return {
      isLoading,
      files,
      addFiles,
      removeFile,
      removeAllFiles,
    }
  }, [isLoading, files, addFiles, removeFile, removeAllFiles])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('Please ensure to wrap your component in a "StorageProvider"!')
  }
  return context
}
