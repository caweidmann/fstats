'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { initTranslations } from '@/lib/i18n'

type LanguageProviderProps = {
  children: ReactNode
}

const Component = ({ children }: LanguageProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      initTranslations()
      setIsInitialized(true)
    }
  }, [])

  if (!isInitialized) {
    return null
  }

  return <>{children}</>
}

export default Component
