import { FeatureFlags } from '@/types'

export const FEATURES: FeatureFlags = {
  open_for_work: true,
  wip: false,
}

export const ALL_FEATURES: FeatureFlags = {
  ...FEATURES,
}
