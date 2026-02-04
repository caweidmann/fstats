import type { FeatureFlags } from '@/types'

export const FEATURES: FeatureFlags = {
  wip: false,
}

export const ALL_FEATURES: FeatureFlags = {
  ...FEATURES,
}
