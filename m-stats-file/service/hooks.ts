'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { StatsFile } from '@/types'

import {
  addFile,
  addFiles,
  getFile,
  getFiles,
  removeAllFiles,
  removeFile,
  removeFiles,
  updateFile,
  updateFiles,
} from '../api'
import { statsFileKey } from './keys'

export const useFile = (id: string) => {
  return useQuery({
    queryKey: statsFileKey.detail(id),
    queryFn: () => {
      return getFile(id)
    },
  })
}

export const useFiles = () => {
  return useQuery({
    queryKey: statsFileKey.all,
    queryFn: () => {
      return getFiles()
    },
  })
}

export const useMutateAddFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: StatsFile) => {
      return addFile(file)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.setQueryData(statsFileKey.detail(data.id), data)
    },
  })
}

export const useMutateAddFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (files: StatsFile[]) => {
      return addFiles(files)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      data.forEach((file) => {
        queryClient.setQueryData(statsFileKey.detail(file.id), file)
      })
    },
  })
}

export const useMutateUpdateFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StatsFile> }) => {
      return updateFile(id, updates)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.setQueryData(statsFileKey.detail(data.id), data)
    },
  })
}

export const useMutateUpdateFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filesToUpdate: { id: string; updates: Partial<StatsFile> }[]) => {
      return updateFiles(filesToUpdate)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      data.forEach((file) => {
        queryClient.setQueryData(statsFileKey.detail(file.id), file)
      })
    },
  })
}

export const useMutateRemoveFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => {
      return removeFile(id)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.removeQueries({ queryKey: statsFileKey.detail(id) })
    },
  })
}

export const useMutateRemoveFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => {
      return removeFiles(ids)
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: statsFileKey.detail(id) })
      })
    },
  })
}

export const useMutateRemoveAllFiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      return removeAllFiles()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statsFileKey.all })
      queryClient.removeQueries({ queryKey: statsFileKey.all })
    },
  })
}
