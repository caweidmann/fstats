'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { User } from '@/types'

import { addUser, getUser, removeUser, updateUser } from '../api'
import { USER_KEY, userKey } from './keys'

export const useRawUser = () => {
  return useQuery({
    queryKey: userKey.detail(USER_KEY),
    queryFn: () => {
      return getUser()
    },
    staleTime: Infinity,
  })
}

export const useUser = () => {
  const { data: user, ...rest } = useRawUser()

  if (!user) {
    throw new Error('User must exist. Ensure user is initialised before using useUser.')
  }

  return { data: user, ...rest }
}

export const useMutateAddUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: User) => {
      return addUser(data)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userKey.detail(USER_KEY), data)
    },
  })
}

export const useMutateUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<User>) => {
      return updateUser(updates)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userKey.detail(USER_KEY), data)
    },
  })
}

export const useMutateRemoveUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      return removeUser()
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKey.detail(USER_KEY) })
    },
  })
}
