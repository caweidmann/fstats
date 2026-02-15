'use client'

import { PageWrapper } from '@/components'
import { DataPage } from '@/m-pages'
import { useFileHelper } from '@/hooks'

const Page = () => {
  const { isLoadingFiles } = useFileHelper()

  if (isLoadingFiles) {
    return <PageWrapper />
  }

  return <DataPage />
}

export default Page
