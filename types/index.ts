import type { Locale } from 'date-fns'
import type { TTermLocalized } from 'dev-dict'
import type { SimpleIcon } from 'simple-icons'

export type DateFnsLocale = Locale

export type Breadcrumb = {
  label: string
  route?: string | undefined
}
