import { startOfDay } from 'date-fns'

import type { ColDef, RowAccessor, RowValueGetter } from '@/types'
import { SortOrder } from '@/types-enums'

export const resolveGetter = <T extends ColDef>(getter: RowValueGetter<T>): ((row: RowAccessor<T>) => string) => {
  if (typeof getter === 'function') {
    return getter
  }
  return (row) => row.get(getter)
}

export const isArrayEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value.trim() === array2[index].trim())
}

export const getCsvSortOrder = (dates: Date[]): SortOrder => {
  let asc = 0
  let desc = 0

  for (let index = 1; index < dates.length; index += 1) {
    const previous = dates[index - 1].getTime()
    const current = dates[index].getTime()

    if (current > previous) {
      asc += 1
      continue
    }

    if (current < previous) {
      desc += 1
    }
  }

  return desc > asc ? SortOrder.DESC : SortOrder.ASC
}

const withSecondOffsets = ({
  dates,
  sortOrder,
  getGroupKey,
  getBaseTimestamp,
}: {
  dates: Date[]
  sortOrder: SortOrder
  getGroupKey: (date: Date) => number
  getBaseTimestamp: (date: Date) => number
}): Date[] => {
  const totalByGroup = new Map<number, number>()
  const seenByGroup = new Map<number, number>()

  dates.forEach((date) => {
    const groupKey = getGroupKey(date)
    totalByGroup.set(groupKey, (totalByGroup.get(groupKey) ?? 0) + 1)
  })

  return dates.map((date) => {
    const groupKey = getGroupKey(date)
    const seen = seenByGroup.get(groupKey) ?? 0
    const total = totalByGroup.get(groupKey) ?? 1
    const secondOffset = sortOrder === 'asc' ? seen : total - seen - 1

    seenByGroup.set(groupKey, seen + 1)

    return new Date(getBaseTimestamp(date) + secondOffset * 1000)
  })
}

export const getDateFormatPrecision = (
  dateFormat: string,
): {
  hasTime: boolean
  hasSeconds: boolean
} => {
  const hasHours = /[HhKk]/.test(dateFormat)
  const hasMinutes = /m/.test(dateFormat)
  const hasSeconds = /s/.test(dateFormat)

  return {
    hasTime: hasHours || hasMinutes || hasSeconds,
    hasSeconds,
  }
}

export const getUniqueTimestamps = ({
  dates,
  dateFormat,
  sortOrder,
}: {
  dates: Date[]
  dateFormat: string
  sortOrder: SortOrder
}): Date[] => {
  const { hasTime, hasSeconds } = getDateFormatPrecision(dateFormat)

  if (hasTime && hasSeconds) {
    return dates
  }

  if (!hasTime) {
    return withSecondOffsets({
      dates,
      sortOrder,
      getGroupKey: (date) => startOfDay(date).getTime(),
      getBaseTimestamp: (date) => startOfDay(date).getTime(),
    })
  }

  return withSecondOffsets({
    dates,
    sortOrder,
    getGroupKey: (date) => date.getTime(),
    getBaseTimestamp: (date) => date.getTime(),
  })
}
