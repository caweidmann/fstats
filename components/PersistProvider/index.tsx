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

/**
 * PersistProvider manages the data persistence setting across the application.
 *
 * It stores the persist flag in IndexedDB and provides it via React context.
 * When persistence is disabled and the page is refreshed, all data is cleared.
 */
const PersistProvider = ({ children }: PersistProviderProps) => {
  const [persistEnabled, setPersistEnabledState] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize persistence setting on mount
  useEffect(() => {
    const initPersistSetting = async () => {
      try {
        // Initialize the IndexedDB service first
        await indexedDBService.init()

        // Get the persist setting from IndexedDB
        const savedSetting = await indexedDBService.getPersistSetting()

        // Check if this is a page refresh
        const isRefresh =
          typeof window !== 'undefined' &&
          window.performance &&
          window.performance.getEntriesByType &&
          window.performance.getEntriesByType('navigation').length > 0 &&
          (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload'

        // If persistence is disabled and this is a refresh, clear all data
        if (!savedSetting && isRefresh) {
          await indexedDBService.clearAllFiles()
        }

        setPersistEnabledState(savedSetting)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize persist setting:', error)
        setPersistEnabledState(false)
        setIsInitialized(true)
      }
    }

    initPersistSetting()
  }, [])

  const setPersistEnabled = useCallback(async (enabled: boolean) => {
    try {
      // Update state immediately for responsive UI
      setPersistEnabledState(enabled)

      // Save to IndexedDB - data will only be cleared on next refresh if disabled
      await indexedDBService.setPersistSetting(enabled)
    } catch (error) {
      console.error('Failed to update persist setting:', error)
      // Revert state on error
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

/**
 * Hook to access the persist context
 */
export const usePersist = (): PersistContextType => {
  const context = useContext(PersistContext)
  if (!context) {
    throw new Error('usePersist must be used within a PersistProvider')
  }
  return context
}

export default PersistProvider
