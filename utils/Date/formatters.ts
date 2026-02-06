import { format, isValid, parse } from 'date-fns'

import { UserLocale } from '@/types-enums'
import { MISC } from '@/common'

import { getDateFnsLocale } from '../Date'

/**
 * Converts a date string or date object to "yyyy-MM-dd" format
 *
 * @param date - Date string or date object
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to "yyyyMMdd"
 *
 * @returns Date string in "yyyy-MM-dd" format
 */
export const toSystemDate = (date: Date | string, options?: { formatFrom?: string }): string => {
  if (!date) {
    throw new Error('Must be Date or string')
  }

  const dateFormat = options?.formatFrom ?? MISC.SYSTEM_DATE_FORMAT
  const dateObject = date instanceof Date ? date : parse(date, dateFormat, new Date())

  if (isValid(dateObject)) {
    return format(dateObject, MISC.SYSTEM_DATE_FORMAT)
  }

  throw new Error('Invalid date')
}

/**
 * Converts a date string to a JS Date object
 *
 * @param date - Date string or date object to convert
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to "yyyy-MM-dd"
 *
 * @returns Date string in `displayDate` format or `formatTo` format.
 */
export const toDate = (date: string, options?: { formatFrom?: string }): Date => {
  let dateObject
  const dateFormat = options?.formatFrom ?? MISC.SYSTEM_DATE_FORMAT

  try {
    dateObject = parse(date, dateFormat, new Date())
  } catch (err) {
    console.error('Invalid date:', err)
    throw new Error('Invalid date')
  }

  if (isValid(dateObject)) {
    return dateObject
  }

  throw new Error('Invalid date')
}

/**
 * Converts a date string or date object to "dd/MM/yyyy" or `options.formatTo` format
 *
 * @param date - Date string or date object to convert
 * @param options - Optional options
 * @param options_formatFrom - The format to convert from when supplying a date string - defaults to "yyyy-MM-dd"
 * @param options_formatTo - The format to return - defaults to "dd/MM/yyyy"
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
  const dateFormatFrom = options?.formatFrom ?? MISC.SYSTEM_DATE_FORMAT
  const dateObject = date instanceof Date ? date : parse(date, dateFormatFrom, new Date())

  if (isValid(dateObject)) {
    return format(dateObject, options.formatTo, { locale: getDateFnsLocale(locale) })
  }

  throw new Error('Invalid date')
}
