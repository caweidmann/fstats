'use client'

import { PageWrapper } from '@/components'
import { useStorage } from '@/context/Storage'
import { useFileHelper } from '@/hooks'

import { EmptyStatsPage, StatsPage } from './components'

const Page = () => {
  const { isLoading } = useStorage()
  const { selectedFiles } = useFileHelper()

  if (isLoading) {
    return <PageWrapper />
  }

  if (!selectedFiles.length) {
    return <EmptyStatsPage />
  }

  return <StatsPage />
}

export default Page
