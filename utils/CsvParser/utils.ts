import type {
  ColDef,
  CreateParserParams,
  Parser,
  ParserConfig,
  PPRowData,
  RowAccessor,
  RowValueGetter,
  Transaction,
} from '@/types'
import { toSystemDate } from '@/utils/Date'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

const resolveGetter = <T extends ColDef>(getter: RowValueGetter<T>): ((row: RowAccessor<T>) => string) => {
  if (typeof getter === 'function') return getter
  return (row) => row.get(getter)
}

export const createParser = <T extends ColDef>({
  bankName,
  accountType,
  currency,
  headerRowIndex,
  columns,
  dateFormat,
  dateGetter,
  descriptionGetter,
  valueGetter,
}: CreateParserParams<T>): ParserConfig => {
  const keys = Object.keys(columns) as (keyof T)[]
  const headers = Object.values(columns)

  const wrapRow = (row: PPRowData): RowAccessor<T> => ({
    get: (key) => row[keys.indexOf(key)].trim(),
  })

  const getDate = resolveGetter(dateGetter)
  const getDescription = resolveGetter(descriptionGetter)
  const getValue = resolveGetter(valueGetter)

  return {
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
        const value = getValue(row) || '0'

        const data: Transaction = {
          date: toSystemDate(getDate(row), { formatFrom: dateFormat }),
          description: getDescription(row),
          value,
          currency,
          category: Big(value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
        }

        return data
      })
    },
  }
}

export const buildRegistry = <T extends Record<string, ParserConfig>>(parserConfigs: T): { [K in keyof T]: Parser } => {
  const registry = {} as { [K in keyof T]: Parser }

  Object.entries(parserConfigs).forEach(([id, config]) => {
    registry[id as keyof T] = {
      ...config,
      id,
    }
  })

  return registry
}
