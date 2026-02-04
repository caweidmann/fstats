import { isAfter, isBefore, isSameDay, parse, parseISO } from 'date-fns'
import { de, enGB } from 'date-fns/locale'

import type {
  DateFnsLocale,
  DateRange,
  DateTimeString,
  SelectOptionWithType,
  SortOrder,
  SystemDateString,
  WeekStartsOnValue,
} from '@/types'
import { DateFormat, UserLocale, WeekStartsOn } from '@/types-enums'
import { MISC } from '@/common'
import { i18n } from '@/lib/i18n'

import { logger } from '../Logger'
import { toDisplayDate } from './formatters'

export const getWeekStartsOnValue = (weekStartsOn: WeekStartsOn): WeekStartsOnValue => {
  switch (weekStartsOn) {
    case WeekStartsOn.SUNDAY:
      return 0
    case WeekStartsOn.MONDAY:
      return 1
    default:
      logger('warn', 'getWeekStartsOnValue()', `No value exists for WeekStartsOn "${weekStartsOn}"`)
      return 1
  }
}

export const getDateFormatLabel = (dateFormat: DateFormat) => {
  switch (dateFormat) {
    case DateFormat.DMY_LONG:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_LONG')
    case DateFormat.DMY_SHORT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_SHORT')
    case DateFormat.MDY_LONG:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.MDY_LONG')
    case DateFormat.MDY_SHORT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.MDY_SHORT')
    case DateFormat.DMY_SLASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_SLASH')
    case DateFormat.DMY_DOT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_DOT')
    case DateFormat.DMY_DASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.DMY_DASH')
    case DateFormat.YMD_SLASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_SLASH')
    case DateFormat.YMD_DOT:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_DOT')
    case DateFormat.YMD_DASH:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD_DASH')
    case DateFormat.YMD:
      return i18n.t('COMPONENTS:DATE_FORMAT_SWITCHER.DATE_FORMAT_OPTIONS.YMD')
    default:
      logger('warn', 'getDateFormatLabel()', `No translation exists for date format "${dateFormat}"`)
      return dateFormat
  }
}

export const getDateFormatSelectOptions = (locale: UserLocale): SelectOptionWithType<DateFormat>[] => {
  return Object.entries(DateFormat).map(([, value]) => {
    return {
      value,
      label: toDisplayDate(new Date(), locale, { formatTo: value }),
    }
  })
}

export const sortByDate = (dateA: SystemDateString, dateB: SystemDateString, orderBy: SortOrder): number => {
  const timeA = parse(dateA, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  const timeB = parse(dateB, MISC.SYSTEM_DATE_FORMAT, new Date()).getTime()
  return orderBy === 'asc' ? timeA - timeB : timeB - timeA
}

export const sortByDateIso = (dateA: DateTimeString, dateB: DateTimeString, orderBy: SortOrder): number => {
  const timeA = parseISO(dateA).getTime()
  const timeB = parseISO(dateB).getTime()
  return orderBy === 'asc' ? timeA - timeB : timeB - timeA
}

// null means into the future
export const isInRange = (date: Date, { start, end = null }: DateRange): boolean => {
  if (end) {
    return isSameDay(date, start) || isSameDay(date, end) || (isAfter(date, start) && isBefore(date, end))
  }
  return isSameDay(date, start) || isAfter(date, start)
}

export const getDateFnsLocale = (locale: UserLocale): DateFnsLocale => {
  switch (locale) {
    // @locale-updates
    case UserLocale.EN:
      return enGB
    case UserLocale.DE:
      return de
    default:
      throw new Error(`Unsupported locale: ${locale}`)
  }
}
