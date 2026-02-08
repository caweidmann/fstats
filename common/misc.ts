import { ColorMode, DateFormat, UserLocale } from '@/types-enums'

import packageJson from '../package.json'

export const CONFIG = {
  APP_VERSION: packageJson.version,
  ENABLE_CONSOLE_LOGGING: process.env.NODE_ENV === 'development',
  TAN_STACK_QUERY_DEVTOOLS: false,
} as const

export const MISC = {
  CENTER_DOT: '·',
  CENTER_DOT_XL: '•',
  M_DASH: '—',
  M_DASH_ALT: '–',
  GLASS_EFFECT: 0.8,
  MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024,
  SYSTEM_DATE_FORMAT: DateFormat.YMD_DASH,
  DEFAULT_DATE_FORMAT: DateFormat.YMD_DASH,
  DEFAULT_LOCALE: UserLocale.EN,
  DEFAULT_COLOR_MODE: ColorMode.SYSTEM,
  DEFAULT_PERSIST_DATA: false,
  LS_I18N_LOCALE_KEY: 'fstats__i18nextLng',
  LS_MUI_COLOR_MODE_KEY: 'fstats__mui-mode',
  LS_LOCALE_KEY: 'fstats__locale',
  LS_COLOR_MODE_KEY: 'fstats__color_mode',
  LS_PERSIST_DATA_KEY: 'fstats__persist_data',
  LS_SELECTED_FILE_IDS_KEY: 'fstats__selected_file_ids',
  SS_SESSION_KEY: 'fstats__session',
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
