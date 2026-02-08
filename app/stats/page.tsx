'use client'

import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { EmptyStatsPage, StatsPage } from './components'

const Page = () => {
  const { selectedFiles, isLoadingFiles } = useFileHelper()

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  if (!selectedFiles.length) {
    return <EmptyStatsPage />
  }

  return <StatsPage />
}

export default Page
