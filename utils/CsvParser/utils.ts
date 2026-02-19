import { formatISO, isValid, parse } from 'date-fns'

import type { ColDef, CreateParserParams, Parser, ParserConfig, RowAccessor, RowData, Transaction } from '@/types'
import { Big } from '@/lib/w-big'

import { getCsvSortOrder, getUniqueTimestamps, isArrayEqual, resolveGetter } from './helper'

export const createParser = <T extends ColDef>({
  bankName,
  accountType,
  currency,
  headerRowIndex,
  columns,
  dateFormat,
  getters,
}: CreateParserParams<T>): ParserConfig => {
  const keys = Object.keys(columns) as (keyof T)[]
  const headers = Object.values(columns)

  const wrapRow = (row: RowData): RowAccessor<T> => ({
    get: (key) => row[keys.indexOf(key)].trim(),
  })

  const getDate = resolveGetter(getters.date)
  const getDescription = resolveGetter(getters.description)
  const getValue = resolveGetter(getters.value)

  return {
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

      const parsedRows = rowsToParse.map((rawRow) => {
        const row = wrapRow(rawRow)
        const value = getValue(row) || '0'
        const parsedDate = parse(getDate(row), dateFormat, new Date())

        if (!isValid(parsedDate)) {
          throw new Error('Invalid date')
        }

        return {
          parsedDate,
          description: getDescription(row),
          value,
        }
      })

      const dates = parsedRows.map((row) => row.parsedDate)
      const sortOrder = getCsvSortOrder(dates)
      const uniqueTimestamps = getUniqueTimestamps({ dates, dateFormat, sortOrder })

      return parsedRows.map((row, index) => {
        const data: Transaction = {
          date: formatISO(uniqueTimestamps[index]),
          description: row.description,
          value: row.value,
          currency,
          category: Big(row.value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
        }

        return data
      })
    },
  }
}

export const buildRegistry = <T extends Record<string, ParserConfig>>(parserConfigs: T): { [K in keyof T]: Parser } => {
  const registry = {} as { [K in keyof T]: Parser }

  Object.entries(parserConfigs).forEach(([id, config]) => {
    registry[id as keyof T] = { ...config, id }
  })

  return registry
}
