import type { Locale } from 'date-fns'

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>

export type Breadcrumb = {
  label: string
  route?: string | undefined
}
