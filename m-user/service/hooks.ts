'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { User } from '@/types'

import { addUser, getUser, getUsers, removeUser, updateUser } from '../api'
import { userKey } from './keys'

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKey.detail(id),
    queryFn: () => {
      return getUser(id)
    },
  })
}

export const useUsers = () => {
  return useQuery({
    queryKey: userKey.all,
    queryFn: () => {
      return getUsers()
    },
  })
}

export const useMutateAddUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: User) => {
      return addUser(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKey.all })
      queryClient.setQueryData(userKey.detail(data.id), data)
    },
  })
}

export const useMutateUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => {
      return updateUser(id, updates)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKey.all })
      queryClient.setQueryData(userKey.detail(data.id), data)
    },
  })
}

export const useMutateRemoveUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return removeUser(id)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKey.all })
      queryClient.removeQueries({ queryKey: userKey.detail(id) })
      // setSelectedUserIds((prev) => prev.filter((dataId) => dataId !== id))
    },
  })
}
