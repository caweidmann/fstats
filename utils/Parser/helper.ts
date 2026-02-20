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
