import { DateFormat } from '@/types-enums'

export const MISC = {
  CENTER_DOT: '·',
  CENTER_DOT_XL: '•',
  M_DASH: '—',
  M_DASH_ALT: '–',
  GLASS_EFFECT: 0.8,
  MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024,
  SUPPORTED_BANKS: ['FNB', 'Capitec', 'Comdirect', 'ING'],
  SYSTEM_DATE_FORMAT: DateFormat.YMD_DASH,
} as const

export const LAYOUT = {
  CONTAINER_MAX_WIDTH: 'lg',
  NAV_Z_INDEX: 20,
  NAV_HEIGHT: 50,
  NAV_HEIGHT_MOBILE: 60,
  NAV_BORDER: 1,
  FOOTER_HEIGHT: 50,
  FOOTER_HEIGHT_MOBILE: 60,
  FOOTER_BORDER: 1,
} as const

export const CONFIG = {
  ENABLE_CONSOLE_LOGGING: process.env.NODE_ENV === 'development',
} as const
