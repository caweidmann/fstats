/**
 * The color mode which is currently applied in the app.
 */
export enum ColorMode {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * The user's chosen locale, under the hood determines the language across the app.
 */
export enum UserLocale {
  EN = 'en',
  DE = 'de',
}

/**
 * The user's chosen date format which applies across the app.
 */
export enum DateFormat {
  DMY_LONG = 'd MMMM yyyy',
  DMY_SHORT = 'd MMM yyyy',
  MDY_LONG = 'MMMM d, yyyy',
  MDY_SHORT = 'MMM d, yyyy',
  DMY_SLASH = 'dd/MM/yyyy',
  DMY_DOT = 'dd.MM.yyyy',
  DMY_DASH = 'dd-MM-yyyy',
  YMD_SLASH = 'yyyy/MM/dd',
  YMD_DOT = 'yyyy.MM.dd',
  YMD_DASH = 'yyyy-MM-dd',
  YMD = 'yyyyMMdd',
}

/**
 * The user's chosen preference which determines on what day the week starts.
 *
 * @remarks
 * The index of the first day of the week (0 - Sunday, 1 - Monday).
 */
export enum WeekStartsOn {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
}

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
