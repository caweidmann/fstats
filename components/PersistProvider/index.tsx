'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { indexedDBService } from '@/lib/storage/indexedDB'

interface PersistContextType {
  persistEnabled: boolean
  setPersistEnabled: (enabled: boolean) => Promise<void>
  isInitialized: boolean
}

const PersistContext = createContext<PersistContextType | null>(null)

interface PersistProviderProps {
  children: ReactNode
}

const PersistProvider = ({ children }: PersistProviderProps) => {
  const [persistEnabled, setPersistEnabledState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initSettings = async () => {
      try {
        await indexedDBService.init()
        const savedPersist = await indexedDBService.getPersistSetting()

        const isRefresh =
          typeof window !== 'undefined' &&
          window.performance &&
          window.performance.getEntriesByType &&
          window.performance.getEntriesByType('navigation').length > 0 &&
          (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload'

        if (!savedPersist && isRefresh) {
          await indexedDBService.clearAllFiles()
        }

        setPersistEnabledState(savedPersist)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize settings:', error)
        setPersistEnabledState(false)
        setIsInitialized(true)
      }
    }

    initSettings()
  }, [])

  const setPersistEnabled = useCallback(async (enabled: boolean) => {
    try {
      setPersistEnabledState(enabled)
      await indexedDBService.setPersistSetting(enabled)
    } catch (error) {
      console.error('Failed to update persist setting:', error)
      const savedSetting = await indexedDBService.getPersistSetting()
      setPersistEnabledState(savedSetting)
    }
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
