import type { UserPreferences } from '@/types'
import { ColorMode, UserLocale } from '@/types-enums'
import { MISC } from '@/common'

import { getItem } from './helper'

export const getLocalUserPreferences = (): UserPreferences => {
  const locale = getItem(MISC.LS_LOCALE_KEY)
  const colorMode = getItem(MISC.LS_COLOR_MODE_KEY)
  const persistData = localStorage.getItem(MISC.LS_PERSIST_DATA_KEY)

  return {
    locale: locale ? (locale as UserLocale) : MISC.DEFAULT_LOCALE,
    colorMode: colorMode ? (colorMode as ColorMode) : MISC.DEFAULT_COLOR_MODE,
    persistData: persistData ? persistData === 'true' : MISC.DEFAULT_PERSIST_DATA,
  }
}
