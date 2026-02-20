import { formatISO, parseISO } from 'date-fns'

import type { ColDef, CreateParserParams, Parser, RowAccessor, RowData, Transaction } from '@/types'
import { ParserId, SortOrder } from '@/types-enums'
import { getUniqueTimestamps, toDate } from '@/utils/Date'
import { getCategory } from '@/utils/TransactionParser'

export const createParser = <T extends ColDef, Id extends ParserId>({
  id,
  bankName,
  accountType,
  currency,
  headerRowIndex,
  columns,
  dateFormat,
  getters,
}: CreateParserParams<T, Id>): Parser<Id> => {
  const keys = Object.keys(columns) as (keyof T)[]
  const headers = Object.values(columns)

  const wrapRow = (row: RowData): RowAccessor<T> => ({
    get: (key) => row[keys.indexOf(key)].trim(),
  })

  return {
    id,
    bankName,
    accountType,
    currency,
    headerRowIndex,
    columns,
    dateFormat,

    detect: (input) => {
      const dataRows = input.data.slice(headerRowIndex + 1)

      if (!dataRows.length) {
        return false
      }

      const headersMatch = isArrayEqual(input.data[headerRowIndex], headers)
      const rowsValid = dataRows.every((row) => row.length === headers.length)

      return headersMatch && rowsValid
    },

    parse: (input) => {
      const rowsToParse = input.data.slice(headerRowIndex + 1).filter((row) => row.length === headers.length)

      const parsedRows: Transaction[] = rowsToParse.map((rawRow) => {
        const row = wrapRow(rawRow)
        return {
          date: formatISO(toDate(getters.date(row), { formatFrom: dateFormat })),
          description: getters.description(row),
          value: getters.value(row) || '0',
          category: getCategory(row),
          currency,
          extra: getters.extra ? getters.extra(row) : null,
        }
      })

      const dates = parsedRows.map((row) => parseISO(row.date))
      const uniqueTimestamps = getUniqueTimestamps({ dates, dateFormat, sortOrder: getCsvSortOrder(dates) })

      return parsedRows.map((row, index) => ({ ...row, date: formatISO(uniqueTimestamps[index]) }))
    },
  }
}

// Strips empty fields from object
export const buildExtra = (fields: Record<string, string>): Transaction['extra'] => {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value)) as Transaction['extra']
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
