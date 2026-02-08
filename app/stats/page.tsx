'use client'

import { useSearchParams } from 'next/navigation'

import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { EmptyStatsPage, StatsPage } from './components'

const Page = () => {
  const { selectedFiles, isLoadingFiles } = useFileHelper()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  if (!selectedFiles.length && !isDemoMode) {
    return <EmptyStatsPage />
  }

  return <StatsPage />
}

export default Page
