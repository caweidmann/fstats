/**
 * The color mode which is currently applied in the app.
 */
export const ColorMode = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode]

/**
 * The user's chosen locale, under the hood determines the language across the app.
 */
export const UserLocale = {
  EN: 'en',
  DE: 'de',
} as const

export type UserLocale = (typeof UserLocale)[keyof typeof UserLocale]

export const SupportedFormats = {
  UNKNOWN: 'unknown',
  CAPITEC: 'capitec',
  // FNB: 'fnb',
  // COMDIRECT: 'comdirect',
  // ING: 'ing',
} as const

export type SupportedFormats = (typeof SupportedFormats)[keyof typeof SupportedFormats]

/**
 * The user's chosen date format which applies across the app.
 */
export const DateFormat = {
  DMY_LONG: 'd MMMM yyyy',
  DMY_SHORT: 'd MMM yyyy',
  MDY_LONG: 'MMMM d, yyyy',
  MDY_SHORT: 'MMM d, yyyy',
  DMY_SLASH: 'dd/MM/yyyy',
  DMY_DOT: 'dd.MM.yyyy',
  DMY_DASH: 'dd-MM-yyyy',
  YMD_SLASH: 'yyyy/MM/dd',
  YMD_DOT: 'yyyy.MM.dd',
  YMD_DASH: 'yyyy-MM-dd',
  YMD: 'yyyyMMdd',
} as const

export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat]

/**
 * The user's chosen preference which determines on what day the week starts.
 *
 * @remarks
 * The index of the first day of the week (0 - Sunday, 1 - Monday).
 */
export const WeekStartsOn = {
  SUNDAY: 'SUNDAY',
  MONDAY: 'MONDAY',
} as const

export type WeekStartsOn = (typeof WeekStartsOn)[keyof typeof WeekStartsOn]

// /**
//  * The user's chosen display currency preference.
//  */
// export enum Currency {
//   // @currency-updates
//   USD = 'USD',
//   EUR = 'EUR',
//   GBP = 'GBP',
//   CHF = 'CHF',
//   SEK = 'SEK',
//   BTC = 'BTC',
//   CNY = 'CNY',
//   RUB = 'RUB',
//   JPY = 'JPY',
//   INR = 'INR',
//   ZAR = 'ZAR',
// }
