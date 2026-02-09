'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

import { CONFIG } from '@/common'
import { getQueryClient } from '@/lib/tanstack-query'

type QueryProviderProps = {
  children: ReactNode
}

const Component = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {CONFIG.ENABLE_TANSTACK_QUERY_DEVTOOLS ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}

export default Component
