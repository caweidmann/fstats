/**
 * Taken from: https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-app-prefetching?path=examples%2Freact%2Fnextjs-app-prefetching%2Fapp%2Fget-query-client.ts
 */
import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false, // Disable for offline-first app (no server to sync with)
        refetchOnReconnect: false, // Disable (data is local)
        retry: 1, // Limit retries for IndexedDB operations
      },
      dehydrate: {
        // Include pending queries in dehydration for SSR
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
