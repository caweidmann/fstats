import type { UserPreferences } from '@/types'
import { ColorMode, UserLocale } from '@/types-enums'
import { useMutateUpdateUser, useUser } from '@/m-user/service'

export const useUserPreferences = (): UserPreferences & {
  setLocale: (locale: UserLocale) => void
  setColorMode: (colorMode: ColorMode) => void
  setPersistData: (persistData: boolean) => void
  isSaving: boolean
} => {
  const { data: user } = useUser()
  const { mutate: updateUser, isPending: isSaving } = useMutateUpdateUser()

  return {
    locale: user.locale,
    colorMode: user.colorMode,
    persistData: user.persistData,
    setLocale: (locale) => updateUser({ locale }),
    setColorMode: (colorMode) => updateUser({ colorMode }),
    setPersistData: (persistData) => updateUser({ persistData }),
    isSaving,
  }
}
