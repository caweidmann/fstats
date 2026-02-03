'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { i18n, initTranslations } from '@/lib/i18n'

initTranslations()

type LanguageProviderProps = {
  children: ReactNode
}

const Component = ({ children }: LanguageProviderProps) => {
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return <>{children}</>
}

export default Component
