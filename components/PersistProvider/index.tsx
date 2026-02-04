'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { indexedDBService } from '@/lib/storage/indexedDB'

interface PersistContextType {
  persistEnabled: boolean
  setPersistEnabled: (enabled: boolean) => void
  isInitialized: boolean
}

const PersistContext = createContext<PersistContextType | null>(null)

const PersistProvider = ({ children }: { children: ReactNode }) => {
  const [persistEnabled, setPersistEnabledState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    indexedDBService
      .init()
      .then(() => {
        setPersistEnabledState(indexedDBService.getPersistSetting())
        setIsInitialized(true)
      })
      .catch((error) => {
        console.error('Failed to initialize storage:', error)
        setIsInitialized(true)
      })
  }, [])

  const setPersistEnabled = useCallback((enabled: boolean) => {
    indexedDBService.setPersistSetting(enabled)
    setPersistEnabledState(enabled)
  }, [])

  const value = useMemo(
    () => ({
      persistEnabled,
      setPersistEnabled,
      isInitialized,
    }),
    [persistEnabled, setPersistEnabled, isInitialized],
  )

  return <PersistContext.Provider value={value}>{children}</PersistContext.Provider>
}

export const usePersist = (): PersistContextType => {
  const context = useContext(PersistContext)
  if (!context) {
    throw new Error('usePersist must be used within a PersistProvider')
  }
  return context
}

export default PersistProvider
