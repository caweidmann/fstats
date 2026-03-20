import './globals.css'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { RootLayout } from '@/components'

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
  applicationName: 'fstats',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'fstats',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
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
        <InitColorSchemeScript attribute="class" />
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}

export default Component
