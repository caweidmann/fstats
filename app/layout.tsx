import './globals.css'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { LanguageProvider, Layout, PersistProvider, ThemeProvider } from '@/components'

const SEO_TITLE = `fstats - Private Financial Statement Analyzer`
const SEO_DESCRIPTION = `Analyze your bank statements safely. 100% private - all data stays on your device, nothing is uploaded. Works completely offline.`

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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
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
      <body>
        {process.env.NODE_ENV === 'production' ? <SpeedInsights /> : null}
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <InitColorSchemeScript attribute="class" />
            <PersistProvider>
              <LanguageProvider>
                <Layout>{children}</Layout>
              </LanguageProvider>
            </PersistProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export default Component
