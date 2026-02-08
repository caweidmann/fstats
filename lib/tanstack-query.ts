/**
 * Taken from: https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-app-prefetching?path=examples%2Freact%2Fnextjs-app-prefetching%2Fapp%2Fget-query-client.ts
 */
import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        retry: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60, // 60 minutes
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
