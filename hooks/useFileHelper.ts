'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { isError, isUnknown, useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const errorFiles = files.filter(isError)
  const unknownFiles = files.filter(isUnknown)
  const selectableFiles = files.filter((file) => !isError(file) && !isUnknown(file))

  return {
    files,
    isLoadingFiles,
    selectedFiles,
    selectableFiles,
    errorFiles,
    unknownFiles,
    selectedFileIds,
    setSelectedFileIds,
  }
}
