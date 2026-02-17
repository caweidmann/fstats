import type { FixedLocaleCurrencyOptions, FixedLocaleOptions, NumberString } from '@/types'
import { Currency, UserLocale } from '@/types-enums'
import { getCurrencySymbol, getMaxDecimalsForCurrency } from '@/utils/Currency'
import { Big } from '@/lib/w-big'

import { getDecimals, getRoundedValue } from './utils'

/**
 * Gets the thousands and decimal separators for a given locale
 *
 * @param locale - The locale to get separators for
 * @returns Object containing thousandsSeparator and decimalSeparator
 */
export const getNumberSeparators = (locale: UserLocale): { thousandsSeparator: string; decimalSeparator: string } => {
  switch (locale) {
    // @locale-updates
    case UserLocale.DE:
      return {
        thousandsSeparator: '.',
        decimalSeparator: ',',
      }
    case UserLocale.EN:
    default:
      return {
        thousandsSeparator: ',',
        decimalSeparator: '.',
      }
  }
}

/**
 * Formats a number string with locale-specific separators
 *
 * @param value - The number to format
 * @param locale - The locale to use
 * @returns Formatted number string with locale-specific separators
 */
export const toLocaleString = (value: NumberString, locale: UserLocale): string => {
  const { thousandsSeparator, decimalSeparator } = getNumberSeparators(locale)
  const isNegative = Big(value).lt(0)
  const unsignedValue = isNegative ? value.slice(1) : value
  const [integerPart, decimalPart = ''] = unsignedValue.split('.')
  const formattedInteger = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandsSeparator}`)
  const formattedNumber = decimalPart ? `${formattedInteger}${decimalSeparator}${decimalPart}` : formattedInteger

  return isNegative ? `-${formattedNumber}` : formattedNumber
}

/**
 * Converts a number to a string with `round` and `locale`
 *
 * @param value - Number to format
 * @param round - Number of digits after the decimal point (null uses existing decimal places)
 * @param locale - Locale to use for formatting (determines separator and decimal point formatting)
 * @param options - Optional options
 * @param options.trimTrailingZeros - Whether to trim trailing zeros, e.g. "7.00" to "7"
 * @param options.append - String to append, or currency object for currency formatting
 * @param options.prepend - String to prepend, or currency object for currency formatting
 *
 * @returns By default returns a string representation of the number to the decimal places of the provided number
 */
export const toFixedLocale = (
  value: NumberString,
  round: number | null = null,
  locale: UserLocale,
  options: FixedLocaleOptions = {
    trimTrailingZeros: false,
    append: null,
    prepend: null,
  },
): string => {
  const trimTrailingZeros = options.trimTrailingZeros ?? false
  let decimalPlaces = round === null ? getDecimals(value) : round
  const roundedValue = getRoundedValue(value, decimalPlaces)

  if (trimTrailingZeros) {
    decimalPlaces = getDecimals(roundedValue)
    if (decimalPlaces > 0 && roundedValue.split('.')[1] === '0'.repeat(decimalPlaces)) {
      decimalPlaces = 0
    }
  }

  let returnValue = toLocaleString(Big(roundedValue).toFixed(decimalPlaces), locale)
  const isNegative = returnValue.startsWith('-')
  returnValue = isNegative ? returnValue.slice(1) : returnValue

  if (options?.append) {
    if (typeof options.append === 'string') {
      returnValue = `${returnValue}${options.append}`
    } else if (typeof options.append === 'object' && options.append.currency) {
      const { currency, format } = options.append
      returnValue = format === 'symbol' ? `${returnValue} ${getCurrencySymbol(currency)}` : `${returnValue} ${currency}`
    }
  }

  if (options?.prepend) {
    if (typeof options.prepend === 'string') {
      returnValue = `${options.prepend}${returnValue}`
    } else if (typeof options.prepend === 'object' && options.prepend.currency) {
      const { currency, format } = options.prepend
      returnValue = format === 'symbol' ? `${getCurrencySymbol(currency)}${returnValue}` : `${currency} ${returnValue}`
    }
  }

  return isNegative ? `-${returnValue}` : returnValue
}

export const toFixedLocaleCurrency = (
  value: NumberString,
  currency: Currency,
  locale: UserLocale,
  {
    rawValue = value,
    isFractional = false,
    currencyFormat = 'symbol',
    trimTrailingZeros = false,
  }: FixedLocaleCurrencyOptions = {
    rawValue: value,
    isFractional: false,
    currencyFormat: 'symbol',
    trimTrailingZeros: false,
  },
): string => {
  let itemDecimals = getDecimals(rawValue)
  const currencyDecimals = getMaxDecimalsForCurrency(currency)

  // For BTC ensure we show at minimum 8 decimals
  if (currency === Currency.BTC && itemDecimals < currencyDecimals) {
    itemDecimals = currencyDecimals
  }

  const options: FixedLocaleOptions = {
    prepend: currencyFormat === 'symbol' ? { currency, format: 'symbol' } : null,
    append: currencyFormat === 'symbol' ? null : { currency },
    trimTrailingZeros,
  }

  return toFixedLocale(value, isFractional ? itemDecimals : currencyDecimals, locale, options)
}
