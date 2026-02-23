import { SortOrder } from '@/types-enums'

export const attachUniqueSecondsToDates = ({
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
