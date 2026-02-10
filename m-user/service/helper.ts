import { User } from '@/types'
import { UserLocale } from '@/types-enums'

export const getUserDefaults = (): User => ({
  created: '',
  modified: '',
  id: '',
  locale: UserLocale.EN,
})
