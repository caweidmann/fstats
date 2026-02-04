import { useLocalStorage } from 'usehooks-ts'

import type { UserPreferences } from '@/types'
import { ColorMode, UserLocale } from '@/types-enums'
import { MISC } from '@/common'

type SetUserPreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void

type UseUserPreferencesReturn = UserPreferences & { set: SetUserPreference }

export const useUserPreferences = (): UseUserPreferencesReturn => {
  const [locale, setLocale] = useLocalStorage<UserLocale>(MISC.LS_LOCALE_KEY, MISC.DEFAULT_LOCALE)
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>(MISC.LS_COLOR_MODE_KEY, MISC.DEFAULT_COLOR_MODE)
  const [persistData, setPersistData] = useLocalStorage<boolean>(MISC.LS_PERSIST_DATA_KEY, MISC.DEFAULT_PERSIST_DATA)

  const set: SetUserPreference = (key, value) => {
    switch (key) {
      case 'locale':
        setLocale(value as UserLocale)
        break
      case 'colorMode':
        setColorMode(value as ColorMode)
        break
      case 'persistData':
        setPersistData(value as boolean)
        break
      default:
        throw new Error(`Invalid user preference key: ${key}`)
    }
  }

  return {
    locale,
    colorMode,
    persistData,
    set,
  }
}
