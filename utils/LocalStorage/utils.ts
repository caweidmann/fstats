import type { UserPreferences } from '@/types'
import { ColorMode, UserLocale } from '@/types-enums'
import { MISC } from '@/common'

export const getLocalUserPreferences = (): UserPreferences => {
  return {
    locale: (window.localStorage.getItem(MISC.LS_LOCALE_KEY) as UserLocale) || MISC.DEFAULT_LOCALE,
    colorMode: (window.localStorage.getItem(MISC.LS_COLOR_MODE_KEY) as ColorMode) || MISC.DEFAULT_COLOR_MODE,
    persistData: window.localStorage.getItem(MISC.LS_PERSIST_DATA_KEY) === 'true' || MISC.DEFAULT_PERSIST_DATA,
  }
}
