'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { type Settings, type SettingKey, readAllSettings, writeSetting } from '@/lib/settings'
import { initStorage } from '@/lib/storage'

interface SettingsContextType {
  settings: Settings
  setSetting: <K extends SettingKey>(key: K, value: Settings[K]) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(readAllSettings)

  useEffect(() => {
    initStorage()
  }, [])

  const setSetting = useCallback(<K extends SettingKey>(key: K, value: Settings[K]) => {
    writeSetting(key, value)
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const value = useMemo(() => ({ settings, setSetting }), [settings, setSetting])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default SettingsProvider
