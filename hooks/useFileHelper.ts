'use client'

import { useStorage } from '@/context/Storage'

export const useFileHelper = () => {
  const { files, selectedFileIds } = useStorage()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const selectableFiles = files.filter((file) => !file.error)
  const errorFiles = files.filter((file) => file.error)

  return {
    selectedFiles,
    selectableFiles,
    errorFiles,
  }
}
