import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'fstats',
    short_name: 'fstats',
    description:
      'Analyse bank statements privately. Add CSV statements and get instant insights. All processing happens entirely on your device — no uploads, no accounts, no tracking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    scope: '/',
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
