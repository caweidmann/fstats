'use client'

import { SupportedFormats } from '@/types-enums'
import { useStorage } from '@/context/Storage'

export const useFileHelper = () => {
  const { files, selectedFileIds } = useStorage()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const selectableFiles = files.filter((file) => !file.error)
  const errorFiles = files.filter((file) => file.error)
  const unknownFiles = files.filter((file) => file.parsedType === SupportedFormats.UNKNOWN)

  return {
    selectedFiles,
    selectableFiles,
    errorFiles,
    unknownFiles,
  }
}
