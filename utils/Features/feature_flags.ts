import type { FeatureFlags } from '@/types'

export const FEATURES: FeatureFlags = {
  wip: process.env.NODE_ENV === 'development',
}

export const ALL_FEATURES: FeatureFlags = {
  ...FEATURES,
}
