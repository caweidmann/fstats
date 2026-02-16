import type { ColDef, CreateParserParams, Parser, PPRowData, RowAccessor, Transaction } from '@/types'
import { toSystemDate } from '@/utils/Date'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const createParser = <T extends ColDef>({
  id,
  bankName,
  accountType,
  currency,
  headerRowIndex,
  columns,
  dateFormat,
  dateGetter,
  descriptionGetter,
  valueGetter,
}: CreateParserParams<T>): Parser => {
  const keys = Object.keys(columns) as (keyof T)[]
  const headers = Object.values(columns)

  const wrapRow = (row: PPRowData): RowAccessor<T> => ({
    get: (key) => row[keys.indexOf(key)].trim(),
  })

  return {
    id,
    bankName,
    accountType,
    currency,
    headerRowIndex,
    columns,

    detect: (input) => {
      const dataRows = input.data.slice(headerRowIndex + 1)

      if (!dataRows.length) {
        return false
      }

      const headersMatch = isEqual(input.data[headerRowIndex], headers)
      const rowsValid = dataRows.every((row) => row.length === headers.length)

      return headersMatch && rowsValid
    },

    parse: (input) => {
      const rowsToParse = input.data.slice(headerRowIndex + 1).filter((row) => row.length === headers.length)

      return rowsToParse.map((rawRow) => {
        const row = wrapRow(rawRow)
        const value = valueGetter(row)

        const data: Transaction = {
          date: toSystemDate(dateGetter(row), { formatFrom: dateFormat }),
          description: descriptionGetter(row),
          value,
          currency,
          category: Big(value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
        }

        return data
      })
    },
  }
}
