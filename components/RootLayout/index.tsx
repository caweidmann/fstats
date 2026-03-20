'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { ChartProvider, Layout, QueryProvider, StorageProvider, ThemeProvider } from '@/components'

import '@/lib/i18n'

type RootLayoutProps = {
  children: ReactNode
}

const Component = ({ children }: RootLayoutProps) => {
  useEffect(() => {
    const cleanupLegacyServiceWorkers = async () => {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return
      }

      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))

        if ('caches' in window) {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
        }
      } catch {
        // Best effort cleanup only.
      }
    }

    void cleanupLegacyServiceWorkers()
  }, [])

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
