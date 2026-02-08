'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { initTranslations } from '@/lib/i18n'

type LanguageProviderProps = {
  children: ReactNode
}

const Component = ({ children }: LanguageProviderProps) => {
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!isInitialized.current) {
      initTranslations()
      isInitialized.current = true
    }
  }, [])

  return <>{children}</>
}

export default Component
