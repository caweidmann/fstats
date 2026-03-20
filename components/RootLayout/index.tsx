'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { ReactNode } from 'react'

import { ChartProvider, Layout, QueryProvider, StorageProvider, ThemeProvider } from '@/components'

import '@/lib/i18n'

type RootLayoutProps = {
  children: ReactNode
}

const Component = ({ children }: RootLayoutProps) => {
  return (
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
  )
}

export default Component
