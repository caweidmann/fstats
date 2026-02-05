'use client'

import { useEffect } from 'react'

import { Color } from '@/styles/colors'

import { useIsDarkMode } from './useIsDarkMode'

export const useDarkModeMetaTagUpdater = () => {
  const isDarkMode = useIsDarkMode()

  useEffect(() => {
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    if (!themeColorMetaTag) {
      return
    }
    themeColorMetaTag.setAttribute('content', isDarkMode ? Color.kycoGrey : Color.white)
  }, [isDarkMode])
}
