import { formatISO } from 'date-fns'

import type { User, UserAtRest } from '@/types'
import { db } from '@/lib/localforage'

import { parseUser, syncUser } from './helper'

export const getUser = async (id: string): Promise<User | null> => {
  if (!id) {
    throw new Error('No ID provided!')
  }
  const data = await db.userStore.getItem<UserAtRest>(id)
  return data ? parseUser(data) : null
}

export const getUsers = async (): Promise<User[]> => {
  const users: User[] = []
  await db.userStore.iterate<UserAtRest, void>((value) => {
    users.push(parseUser(value))
  })
  return users
}

export const addUser = async (data: User): Promise<User> => {
  if (!data) {
    throw new Error('No data provided!')
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...data,
    id: crypto.randomUUID(),
    created: modified,
    modified,
  }

  await db.userStore.setItem<UserAtRest>(updatedUser.id, syncUser(updatedUser))

  return updatedUser
}

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const data = await db.userStore.getItem<UserAtRest>(id)

  if (!data) {
    throw new Error(`User with id ${id} not found`)
  }

  const modified = formatISO(new Date())
  const updatedUser: User = {
    ...parseUser(data),
    ...updates,
    modified,
  }

  await db.userStore.setItem<UserAtRest>(id, syncUser(updatedUser))

  return updatedUser
}

export const removeUser = async (id: string): Promise<void> => {
  await db.userStore.removeItem(id)
}
