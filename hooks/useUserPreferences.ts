import type { UserPreferences } from '@/types'
import { useUser } from '@/m-user/service'

export const useUserPreferences = (): UserPreferences => {
  const { data: user } = useUser()

  return {
    locale: user.locale,
    colorMode: user.colorMode,
    persistData: user.persistData,
  }
}
