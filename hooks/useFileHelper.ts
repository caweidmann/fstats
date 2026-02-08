'use client'

import type { StatsFile } from '@/types'

export const useFileHelper = (files: StatsFile[], selectedFileIds: string[]) => {
  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const selectableFiles = files.filter((file) => !file.error)
  const errorFiles = files.filter((file) => file.error)
  const unknownFiles = files.filter((file) => !file.parserId)

  return {
    selectedFiles,
    selectableFiles,
    errorFiles,
    unknownFiles,
  }
}
