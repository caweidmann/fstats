import './globals.css'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { CONFIG } from '@/common'
import { ChartProvider, LanguageProvider, Layout, QueryProvider, StorageProvider, ThemeProvider } from '@/components'

const SEO_TITLE = `fstats - Analyse bank statements privately`
const SEO_DESCRIPTION = `Add CSV statements and get instant insights. All processing happens entirely on your device — no uploads, no accounts, no tracking.`

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  openGraph: {
    siteName: SEO_TITLE,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/img/logo-440x440.png`,
        width: 440,
        height: 440,
      },
    ],
    type: 'website',
  },
}

type LayoutProps = {
  children: ReactNode
}

const Component = ({ children }: LayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#2a2e36" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        {process.env.NODE_ENV === 'production' && CONFIG.ENABLE_SPEED_INSIGHTS ? <SpeedInsights /> : null}
        {process.env.NODE_ENV === 'production' && CONFIG.ENABLE_ANALYTICS ? <Analytics /> : null}

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <QueryProvider>
            <StorageProvider>
              <ThemeProvider>
                <InitColorSchemeScript attribute="class" />
                <LanguageProvider>
                  <ChartProvider>
                    <Layout>{children}</Layout>
                  </ChartProvider>
                </LanguageProvider>
              </ThemeProvider>
            </StorageProvider>
          </QueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export default Component
