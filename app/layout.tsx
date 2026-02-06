import './globals.css'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { ChartProvider, LanguageProvider, Layout, ThemeProvider } from '@/components'
import { StorageProvider } from '@/context/Storage'

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
        {process.env.NODE_ENV === 'production' ? <SpeedInsights /> : null}
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <InitColorSchemeScript attribute="class" />
            <LanguageProvider>
              <StorageProvider>
                <ChartProvider>
                  <Layout>{children}</Layout>
                </ChartProvider>
              </StorageProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export default Component
