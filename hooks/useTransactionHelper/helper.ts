import { eachMonthOfInterval, eachWeekOfInterval, eachYearOfInterval, format, formatISO } from 'date-fns'

import type { DateRange, GroupDataByOption, Transaction, TransactionRangeItem } from '@/types'
import { DateFormat, UserLocale, WeekStartsOn } from '@/types-enums'
import {
  getDateFnsLocale,
  getDaysInRange,
  // getStartEndOfMonth,
  // getStartEndOfWeek,
  // getStartEndOfYear,
  // toDate,
  toDisplayDate,
} from '@/utils/Date'

const getTransactionsInRange = ({
  groupDataBy,
  dateRanges,
  transactions,
  locale,
  dateFormat: formatTo,
  dayFormatter,
}: {
  groupDataBy: GroupDataByOption
  dateRanges: DateRange[]
  transactions: Transaction[]
  locale: UserLocale
  dateFormat: DateFormat
  dayFormatter?: (date: Date) => string
}): TransactionRangeItem[] => {
  const dateFnsLocale = getDateFnsLocale(locale)
  const rangeItems: TransactionRangeItem[] = []

  dateRanges.forEach((range) => {
    const dateRangeTransactions: Transaction[] = []
    const daysInRange = getDaysInRange({ start: range.start, end: range.end })

    daysInRange.forEach((date) => {
      const dateToCheck = formatISO(date).split('T')[0]
      const transactionsInRange = transactions.filter((transaction) => {
        const transactionDate = transaction.date.split('T')[0]
        return transactionDate === dateToCheck
      })
      if (transactionsInRange.length) {
        dateRangeTransactions.push(...transactionsInRange)
      }
    })

    let label = ''
    switch (groupDataBy) {
      case 'day':
        if (dayFormatter && typeof dayFormatter !== 'function') {
          console.warn('getTransactionsInRange()', 'dayFormatter must be a function! Defaulting to display date.')
        }
        label =
          typeof dayFormatter === 'function'
            ? dayFormatter(range.start)
            : toDisplayDate(range.start, locale, { formatTo })
        break

      // case 'week':
      //   // TODO: Double check logic, we only have conditional because range.end is possibly null, but if you choose a week then there will always be an end date
      //   if (range.end) {
      //     label = `${toDisplayDate(range.start, locale, { formatTo })} - ${toDisplayDate(range.end, locale, { formatTo })}`
      //   } else {
      //     label = toDisplayDate(range.start, locale, { formatTo })
      //   }
      //   break

      // case 'month':
      //   label = format(range.start, 'MMMM, yyyy', { locale: dateFnsLocale })
      //   break

      // case 'year':
      //   label = format(range.start, 'yyyy', { locale: dateFnsLocale })
      //   break

      default:
        console.warn('Unknown groupDataBy', groupDataBy)
    }

    rangeItems.push({
      range,
      label,
      transactions: dateRangeTransactions,
    })
  })

  return rangeItems
}

export const getTransactionsGroupedIntoRanges = ({
  groupDataBy,
  dateRange,
  transactions,
  locale,
  dateFormat,
  weekStartsOn,
  dayFormatter,
}: {
  groupDataBy: GroupDataByOption
  dateRange: DateRange
  transactions: Transaction[]
  locale: UserLocale
  dateFormat: DateFormat
  weekStartsOn?: WeekStartsOn
  dayFormatter?: (date: Date) => string
}): TransactionRangeItem[] => {
  let rangeItems: TransactionRangeItem[] = []

  switch (groupDataBy) {
    case 'day': {
      const daysInRange = getDaysInRange({ start: dateRange.start, end: dateRange.end })
      rangeItems = getTransactionsInRange({
        dateRanges: daysInRange.map((day) => ({ start: day, end: day })),
        groupDataBy,
        transactions,
        locale,
        dateFormat,
        dayFormatter: dayFormatter ?? undefined,
      })
      break
    }

    // case 'week': {
    //   if (!weekStartsOn) {
    //     throw new Error('getTransactionsGroupedIntoRanges(): `weekStartsOn` is required to group by "week"')
    //   }
    //   const weeksInRange = eachWeekOfInterval(
    //     { start: toDate(dateRange.start), end: toDate(dateRange.end) },
    //     { weekStartsOn },
    //   )
    //   rangeItems = getTransactionsInRange({
    //     dateRanges: weeksInRange.map((week) => getStartEndOfWeek(week)),
    //     groupDataBy,
    //     transactions,
    //   })
    //   break
    // }

    // case 'month': {
    //   const monthsInRange = eachMonthOfInterval({
    //     start: toDate(dateRange.start),
    //     end: toDate(dateRange.end),
    //   })
    //   rangeItems = getTransactionsInRange({
    //     dateRanges: monthsInRange.map((month) => getStartEndOfMonth(month)),
    //     groupDataBy,
    //     transactions,
    //   })
    //   break
    // }

    // case 'year': {
    //   const yearsInRange = eachYearOfInterval({
    //     start: toDate(dateRange.start),
    //     end: toDate(dateRange.end),
    //   })
    //   rangeItems = getTransactionsInRange({
    //     dateRanges: yearsInRange.map((month) => getStartEndOfYear(month)),
    //     groupDataBy,
    //     transactions,
    //   })
    //   break
    // }

    default:
      console.warn('Unknown groupDataBy', groupDataBy)
  }

  return rangeItems
}
