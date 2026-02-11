import type { User } from '@/types'
import { MISC } from '@/common'
import { getQueryClient } from '@/lib/tanstack-query'

import { addUser, getUser } from '../api'
import { USER_KEY, userKey } from './keys'

export const getUserDefaults = (): User => ({
  created: '',
  modified: '',
  id: '',
  locale: MISC.DEFAULT_LOCALE,
  colorMode: MISC.DEFAULT_COLOR_MODE,
  persistData: MISC.DEFAULT_PERSIST_DATA,
})

/**
 * Ensures user exists in storage and populates query cache. This allows us to
 * call `useUser()` without having to check whether the user call is loading.
 */
export const ensureUserExists = async (): Promise<User> => {
  const queryClient = getQueryClient()
  let user = await getUser()

  if (!user) {
    user = await addUser(getUserDefaults())
  }

  queryClient.setQueryData(userKey.detail(USER_KEY), user)

  return user
}
