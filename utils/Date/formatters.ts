import { format, isValid, parse, parseISO } from 'date-fns'

import { UserLocale } from '@/types-enums'

import { getDateFnsLocale } from '../Date'

/**
 * Converts a date string or date object to "dd/MM/yyyy" or `options.formatTo` format
 *
 * @param date - Date string or date object to convert
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to "yyyy-MM-dd"
 * @param options_formatTo - The format to return - defaults to ISO date format
 *
 * @returns Date string in `displayDate` format or `formatTo` format.
 */
export const toDisplayDate = (
  date: Date | string,
  locale: UserLocale,
  options: {
    formatTo: string
    formatFrom?: string
  },
): string => {
  if (!date) {
    throw new Error('Must be Date or string')
  }
  const dateObject =
    date instanceof Date ? date : options?.formatFrom ? parse(date, options.formatFrom, new Date()) : parseISO(date)

  if (isValid(dateObject)) {
    return format(dateObject, options.formatTo, { locale: getDateFnsLocale(locale) })
  }

  throw new Error('Invalid date')
}
