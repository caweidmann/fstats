import type { NumberString } from '@/types'
import { UserLocale } from '@/types-enums'
import { Big } from '@/lib/w-big'

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
