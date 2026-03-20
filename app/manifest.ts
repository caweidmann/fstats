import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'fstats',
    short_name: 'fstats',
    description: `Analyse bank statements privately. Add CSV statements and get instant insights. All processing happens entirely on your device — no uploads, no accounts, no tracking.`,
    background_color: '#ffffff',
    theme_color: '#ffffff',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      {
        src: '/img/logo-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/img/logo-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
