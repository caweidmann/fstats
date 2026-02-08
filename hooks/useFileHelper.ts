'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { useFiles } from '@/m-stats-file/service'

export const useFileHelper = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()

  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const selectableFiles = files.filter((file) => !file.error)
  const errorFiles = files.filter((file) => file.error)
  const unknownFiles = files.filter((file) => !file.parserId)

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
