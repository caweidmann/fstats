/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const APP_ROUTES = ['/', '/data', '/stats', '/settings']

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()

// Warm caches for all app routes on activation so client-side
// navigation works offline even for pages not yet visited.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all(
      APP_ROUTES.flatMap((route) => [
        // RSC prefetch payload (used by Next.js link prefetching)
        cacheRoute(route, { RSC: '1', 'Next-Router-Prefetch': '1' }, 'pages-rsc-prefetch'),
        // RSC payload (used by client-side navigation)
        cacheRoute(route, { RSC: '1' }, 'pages-rsc'),
        // HTML page (used by full-page navigation / hard refresh)
        cacheRoute(route, {}, 'pages'),
      ]),
    ),
  )
})

const cacheRoute = async (route: string, headers: Record<string, string>, cacheName: string) => {
  try {
    const req = new Request(route, { headers })
    const res = await fetch(req)
    if (res.ok) {
      const cache = await caches.open(cacheName)
      await cache.put(req, res)
    }
  } catch {
    // Network unavailable during activation — skip silently
  }
}
