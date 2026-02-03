import { ALL_FEATURES } from './feature_flags'

export const isFeatureEnabled = (featureFlag: string): boolean => {
  return ALL_FEATURES[featureFlag]
}
