import { differenceInDays, differenceInWeeks, intervalToDuration, isValid } from 'date-fns'
import { de, enGB } from 'date-fns/locale'

import type { DateFnsLocale } from '@/types'
import { UserLocale } from '@/types-enums'

export const getDateFnsLocale = (locale: string): DateFnsLocale => {
  switch (locale) {
    case UserLocale.EN:
      return enGB
    case UserLocale.DE:
      return de
    default:
      throw new Error(`Unsupported locale: ${locale}`)
  }
}

export const formatDateDifference = (startDate: string, endDate: string | null, locale: string) => {
  if (!isValid(new Date(startDate)) || (endDate && !isValid(new Date(endDate)))) {
    return
  }

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const duration = intervalToDuration({ start, end })

  // Calculate total months including years
  const totalMonths = (duration.years || 0) * 12 + (duration.months || 0)

  // For periods >= 3 months, use years and months
  if (totalMonths >= 3) {
    const years = duration.years || 0
    const months = duration.months || 0
    const parts = []

    if (years > 0) {
      if (locale === UserLocale.DE) {
        parts.push(`${years} Jahr${years !== 1 ? 'e' : ''}`)
      } else {
        parts.push(`${years} year${years !== 1 ? 's' : ''}`)
      }
    }

    if (months > 0) {
      if (locale === UserLocale.DE) {
        parts.push(`${months} Monat${months !== 1 ? 'e' : ''}`)
      } else {
        parts.push(`${months} month${months !== 1 ? 's' : ''}`)
      }
    }

    // If we have both years and months, join them
    if (parts.length > 0) {
      return parts.join(' ')
    }

    // Fallback for edge cases (shouldn't happen with totalMonths >= 3)
    if (locale === UserLocale.DE) {
      return '1 Monat'
    }
    return '1 month'
  } else {
    // For periods < 3 months, use weeks or days
    const weeks = differenceInWeeks(end, start)

    if (weeks >= 2) {
      if (locale === UserLocale.DE) {
        return `${weeks} Woche${weeks !== 1 ? 'n' : ''}`
      }
      return `${weeks} week${weeks !== 1 ? 's' : ''}`
    } else {
      // For very short periods, use days
      const days = Math.max(1, differenceInDays(end, start) + 1)
      if (locale === UserLocale.DE) {
        return `${days} Tag${days !== 1 ? 'e' : ''}`
      }
      return `${days} day${days !== 1 ? 's' : ''}`
    }
  }
}
