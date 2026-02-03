'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { indexedDBService, type UploadMode } from '@/lib/storage/indexedDB'

interface SettingsContextType {
  persistEnabled: boolean
  setPersistEnabled: (enabled: boolean) => Promise<void>
  uploadMode: UploadMode
  setUploadMode: (mode: UploadMode) => Promise<void>
  isInitialized: boolean
}

const SettingsContext = createContext<SettingsContextType | null>(null)

interface PersistProviderProps {
  children: ReactNode
}

/**
 * PersistProvider manages app settings across the application.
 *
 * It stores settings in IndexedDB and provides them via React context.
 * When persistence is disabled and the page is refreshed, all data is cleared.
 */
const PersistProvider = ({ children }: PersistProviderProps) => {
  const [persistEnabled, setPersistEnabledState] = useState(false)
  const [uploadMode, setUploadModeState] = useState<UploadMode>('file')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize settings on mount
  useEffect(() => {
    const initSettings = async () => {
      try {
        // Initialize the IndexedDB service first
        await indexedDBService.init()

        // Get settings from IndexedDB
        const [savedPersist, savedUploadMode] = await Promise.all([
          indexedDBService.getPersistSetting(),
          indexedDBService.getUploadMode(),
        ])

        // Check if this is a page refresh
        const isRefresh =
          typeof window !== 'undefined' &&
          window.performance &&
          window.performance.getEntriesByType &&
          window.performance.getEntriesByType('navigation').length > 0 &&
          (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload'

        // If persistence is disabled and this is a refresh, clear all data and reset settings
        if (!savedPersist && isRefresh) {
          await indexedDBService.clearAllFiles()
          // Reset upload mode to default when persist is disabled
          await indexedDBService.setUploadMode('file')
          setUploadModeState('file')
        } else {
          setUploadModeState(savedUploadMode)
        }

        setPersistEnabledState(savedPersist)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize settings:', error)
        setPersistEnabledState(false)
        setUploadModeState('file')
        setIsInitialized(true)
      }
    }

    initSettings()
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

  const setUploadMode = useCallback(async (mode: UploadMode) => {
    try {
      // Update state immediately for responsive UI
      setUploadModeState(mode)

      // Save to IndexedDB
      await indexedDBService.setUploadMode(mode)
    } catch (error) {
      console.error('Failed to update upload mode:', error)
      // Revert state on error
      const savedMode = await indexedDBService.getUploadMode()
      setUploadModeState(savedMode)
    }
  }, [])

  const value = useMemo(
    () => ({
      persistEnabled,
      setPersistEnabled,
      uploadMode,
      setUploadMode,
      isInitialized,
    }),
    [persistEnabled, setPersistEnabled, uploadMode, setUploadMode, isInitialized],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/**
 * Hook to access the settings context
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a PersistProvider')
  }
  return context
}

// Alias for backward compatibility
export const usePersist = useSettings

export default PersistProvider
