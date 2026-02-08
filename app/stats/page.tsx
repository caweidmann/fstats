'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'
import { PageWrapper } from '@/components'
import { useFiles } from '@/m-stats-file/service'
import { useFileHelper } from '@/hooks'

import { EmptyStatsPage, StatsPage } from './components'

const Page = () => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()
  const { selectedFiles } = useFileHelper(files, selectedFileIds)

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  if (!selectedFiles.length) {
    return <EmptyStatsPage />
  }

  return <StatsPage />
}

export default Page
