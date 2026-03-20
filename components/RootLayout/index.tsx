'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { SerwistProvider } from '@serwist/turbopack/react'
import type { ReactNode } from 'react'

import { ChartProvider, Layout, QueryProvider, StorageProvider, ThemeProvider } from '@/components'

import '@/lib/i18n'

type RootLayoutProps = {
  children: ReactNode
}

const Component = ({ children }: RootLayoutProps) => {
  return (
    <SerwistProvider swUrl="/serwist/sw.js">
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <QueryProvider>
          <StorageProvider>
            <ThemeProvider>
              <ChartProvider>
                <Layout>{children}</Layout>
              </ChartProvider>
            </ThemeProvider>
          </StorageProvider>
        </QueryProvider>
      </AppRouterCacheProvider>
    </SerwistProvider>
  )
}

export default Component
