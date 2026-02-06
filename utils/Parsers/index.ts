import type { Parser } from '@/types'

import { CapitecParser } from './Capitec'

export const AVAILABLE_PARSERS: Record<'capitec__savings', Parser> = {
  capitec__savings: CapitecParser,
}
