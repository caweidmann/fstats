import { z } from 'zod'

// -------------------------------------------------------

/**
 * The color mode which is currently applied in the app.
 */
export const ColorMode = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const zColorMode = z.enum([ColorMode.SYSTEM, ColorMode.LIGHT, ColorMode.DARK] as const)

export type ColorMode = z.infer<typeof zColorMode>

// -------------------------------------------------------

/**
 * The user's chosen locale, under the hood determines the language across the app.
 */
export const UserLocale = {
  EN: 'en',
  DE: 'de',
} as const

export const zUserLocale = z.enum([UserLocale.EN, UserLocale.DE] as const)

export type UserLocale = z.infer<typeof zUserLocale>

// -------------------------------------------------------

/**
 * The status of a file, usually goes directly to "parsing" and when parsed to "parsed".
 */
export const StatsFileStatus = {
  PARSING: 'parsing',
  PARSED: 'parsed',
  ERROR: 'error',
} as const

export const zStatsFileStatus = z.enum([
  StatsFileStatus.PARSING,
  StatsFileStatus.PARSED,
  StatsFileStatus.ERROR,
] as const)

export type StatsFileStatus = z.infer<typeof zStatsFileStatus>

// -------------------------------------------------------

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

export const zDateFormat = z.enum([
  DateFormat.DMY_LONG,
  DateFormat.DMY_SHORT,
  DateFormat.MDY_LONG,
  DateFormat.MDY_SHORT,
  DateFormat.DMY_SLASH,
  DateFormat.DMY_DOT,
  DateFormat.DMY_DASH,
  DateFormat.YMD_SLASH,
  DateFormat.YMD_DOT,
  DateFormat.YMD_DASH,
  DateFormat.YMD,
] as const)

export type DateFormat = z.infer<typeof zDateFormat>

// -------------------------------------------------------

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

export const zWeekStartsOn = z.enum([WeekStartsOn.SUNDAY, WeekStartsOn.MONDAY] as const)

export type WeekStartsOn = z.infer<typeof zWeekStartsOn>

// -------------------------------------------------------

/**
 * The WeekStartsOnValue can only be a number between 0 - 6 and in our case we only use Sunday or Monday,
 * i.e. 0 or 1.
 */
export const WeekStartsOnValue = {
  SUNDAY: 0,
  MONDAY: 1,
} as const

export const zWeekStartsOnValue = z.union([z.literal(WeekStartsOnValue.SUNDAY), z.literal(WeekStartsOnValue.MONDAY)])

export type WeekStartsOnValue = z.infer<typeof zWeekStartsOnValue>

// -------------------------------------------------------

/**
 * The user's chosen display currency preference.
 */
export const Currency = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CHF: 'CHF',
  SEK: 'SEK',
  BTC: 'BTC',
  CNY: 'CNY',
  RUB: 'RUB',
  JPY: 'JPY',
  INR: 'INR',
  ZAR: 'ZAR',
} as const

export const zCurrency = z.enum([
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.CHF,
  Currency.SEK,
  Currency.BTC,
  Currency.CNY,
  Currency.RUB,
  Currency.JPY,
  Currency.INR,
  Currency.ZAR,
] as const)

export type Currency = z.infer<typeof zCurrency>

// -------------------------------------------------------

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export const zSortOrder = z.enum([SortOrder.ASC, SortOrder.DESC] as const)

export type SortOrder = z.infer<typeof zSortOrder>

// -------------------------------------------------------

export const ParserId = {
  CAPITEC_SAVINGS: 'capitec__savings',
  COMDIRECT_GIRO: 'comdirect__giro',
  COMDIRECT_VISA: 'comdirect__visa',
  FNB_CREDIT_CARD: 'fnb__credit_card',
  ING_GIRO: 'ing__giro',
  ING_GIRO_WB: 'ing__giro_wb',
  LLOYDS_CURRENT: 'lloyds__current',
} as const

export const zParserId = z.enum([
  ParserId.CAPITEC_SAVINGS,
  ParserId.COMDIRECT_GIRO,
  ParserId.COMDIRECT_VISA,
  ParserId.FNB_CREDIT_CARD,
  ParserId.ING_GIRO,
  ParserId.ING_GIRO_WB,
  ParserId.LLOYDS_CURRENT,
] as const)

export type ParserId = z.infer<typeof zParserId>

// -------------------------------------------------------
