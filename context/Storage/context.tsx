'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { StatsFile, StatsFileAtRest, StorageContextState } from '@/types'
import { MISC } from '@/common'
import { db } from '@/lib/localforage'

import { getFiles, initStorage, parseFileFromStorage, syncFileToStorage } from './helper'

const StorageContext = createContext<StorageContextState | null>(null)

type StorageContextProviderProps = {
  children: ReactNode
}

export const StorageProvider = ({ children }: StorageContextProviderProps) => {
  const [files, setFiles] = useState<StatsFile[]>([])
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
    async (filesToAdd: StatsFile[]) => {
      const promises = filesToAdd.map((file) =>
        db.filesStore.setItem<StatsFileAtRest>(file.id, syncFileToStorage(file)),
      )
      await Promise.all(promises)
      setFiles((prev) => [...prev, ...filesToAdd])
      setSelectedFileIds((prev) => [...prev, ...filesToAdd.filter((file) => !file.error).map((file) => file.id)])
    },
    [setSelectedFileIds],
  )

  const updateFile = useCallback(async (id: string, updates: Partial<StatsFile>) => {
    const file = await db.filesStore.getItem<StatsFileAtRest>(id)
    if (!file) {
      throw new Error('File not found!')
    }
    const updatedFile = { ...parseFileFromStorage(file), ...updates }
    await db.filesStore.setItem<StatsFileAtRest>(id, syncFileToStorage(updatedFile))
    setFiles((prev) => prev.map((ifile) => (ifile.id === id ? updatedFile : ifile)))
  }, [])

  const removeFiles = useCallback(
    async (ids: string[]) => {
      const promises = ids.map((id) => db.filesStore.removeItem(id))
      await Promise.all(promises)
      setFiles((prev) => prev.filter((file) => !ids.includes(file.id)))
      setSelectedFileIds((prev) => prev.filter((fileId) => !ids.includes(fileId)))
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
      removeFiles,
      removeAllFiles,
    }
  }, [isLoading, files, selectedFileIds, setSelectedFileIds, addFiles, updateFile, removeFiles, removeAllFiles])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('Please ensure to wrap your component in a "StorageProvider"!')
  }
  return context
}
