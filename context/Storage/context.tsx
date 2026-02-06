'use client'

import { formatISO } from 'date-fns'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { FileData, StorageContextState } from '@/types'
import { MISC } from '@/common'
import { db } from '@/lib/localforage'

import { getFiles, initStorage } from './helper'

const StorageContext = createContext<StorageContextState | null>(null)

type StorageContextProviderProps = {
  children: ReactNode
}

export const StorageProvider = ({ children }: StorageContextProviderProps) => {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])

  useEffect(() => {
    const init = async () => {
      await initStorage()
      const storedFiles = await getFiles()
      setFiles(storedFiles)
      setIsLoading(false)
    }
    init()
  }, [])

  const addFiles = useCallback(
    async (filesToAdd: FileData[]) => {
      const promises = filesToAdd.map((file) => db.filesStore.setItem(file.id, file))
      await Promise.all(promises)
      setFiles((prev) => [...prev, ...filesToAdd])
      setSelectedFileIds((prev) => [...prev, ...filesToAdd.filter((file) => !file.error).map((file) => file.id)])
    },
    [setSelectedFileIds],
  )

  const updateFile = useCallback(async (id: string, updates: Partial<FileData>) => {
    const file = await db.filesStore.getItem<FileData>(id)
    if (!file) {
      throw new Error('File not found!')
    }
    const updatedFile = { ...file, ...updates }
    await db.filesStore.setItem(id, updatedFile)
    setFiles((prev) => prev.map((ifile) => (ifile.id === id ? updatedFile : ifile)))
  }, [])

  const removeFile = useCallback(
    async (id: string) => {
      await db.filesStore.removeItem(id)
      setFiles((prev) => prev.filter((file) => file.id !== id))
      setSelectedFileIds((prev) => prev.filter((fileId) => fileId !== id))
    },
    [setSelectedFileIds],
  )

  const removeAllFiles = useCallback(async () => {
    await db.filesStore.clear()
    setFiles([])
    setSelectedFileIds([])
  }, [setSelectedFileIds])

  const value = useMemo(() => {
    return {
      isLoading,
      files,
      selectedFileIds,
      setSelectedFileIds,
      addFiles,
      updateFile,
      removeFile,
      removeAllFiles,
    }
  }, [isLoading, files, selectedFileIds, setSelectedFileIds, addFiles, updateFile, removeFile, removeAllFiles])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('Please ensure to wrap your component in a "StorageProvider"!')
  }
  return context
}
