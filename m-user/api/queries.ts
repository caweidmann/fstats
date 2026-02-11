import { formatISO } from 'date-fns'

import type { User, UserAtRest } from '@/types'
import { db } from '@/lib/localforage'

import { USER_KEY } from '../service'
import { parseUser, syncUser } from './helper'

export const getUser = async (): Promise<User | null> => {
  const data = await db.userStore.getItem<UserAtRest>(USER_KEY)
  return data ? parseUser(data) : null
}

export const addUser = async (data: User): Promise<User> => {
  if (!data) {
    throw new Error('No data provided!')
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...data,
    id: USER_KEY,
    created: modified,
    modified,
  }

  await db.userStore.setItem<UserAtRest>(USER_KEY, syncUser(updatedUser))

  return updatedUser
}

export const updateUser = async (updates: Partial<User>): Promise<User> => {
  const data = await db.userStore.getItem<UserAtRest>(USER_KEY)

  if (!data) {
    throw new Error(`User with id "${USER_KEY}" not found`)
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...parseUser(data),
    ...updates,
    modified,
  }

  await db.userStore.setItem<UserAtRest>(USER_KEY, syncUser(updatedUser))

  return updatedUser
}

export const removeUser = async (): Promise<void> => {
  await db.userStore.removeItem(USER_KEY)
}
