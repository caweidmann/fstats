'use client'

import type { UserPreferences } from '@/types'
import { ColorMode, DateFormat, UserLocale } from '@/types-enums'
import { useMutateUpdateUser, useUser } from '@/m-user/service'

export const useUserPreferences = (): UserPreferences & {
  setLocale: (locale: UserLocale) => void
  setColorMode: (colorMode: ColorMode) => void
  setPersistData: (persistData: boolean) => void
  setDateFormat: (dateFormat: DateFormat) => void
  isSaving: boolean
} => {
  const { data: user } = useUser()
  const { mutate: updateUser, isPending: isSaving } = useMutateUpdateUser()

  return {
    locale: user.locale,
    colorMode: user.colorMode,
    persistData: user.persistData,
    dateFormat: user.dateFormat,
    setLocale: (locale) => updateUser({ locale }),
    setColorMode: (colorMode) => updateUser({ colorMode }),
    setPersistData: (persistData) => updateUser({ persistData }),
    setDateFormat: (dateFormat) => updateUser({ dateFormat }),
    isSaving,
  }
}
