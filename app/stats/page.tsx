'use client'

import { useFileHelper } from '@/hooks'

import { EmptyStatsPage, StatsPage } from './components'

const Page = () => {
  const { selectedFiles } = useFileHelper()

  if (!selectedFiles.length) {
    return <EmptyStatsPage />
  }

  return <StatsPage />
}

export default Page
