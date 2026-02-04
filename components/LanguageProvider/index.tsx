'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { MISC } from '@/common'
import { i18n, initTranslations } from '@/lib/i18n'

initTranslations()

type LanguageProviderProps = {
  children: ReactNode
}

const Component = ({ children }: LanguageProviderProps) => {
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(MISC.LS_LOCALE_KEY)
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  return <>{children}</>
}

export default Component
