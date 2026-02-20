import { formatISO, isValid, parse } from 'date-fns'

import type { ColDef, CreateParserParams, Parser, RowAccessor, RowData, Transaction } from '@/types'
import { ParserId } from '@/types-enums'
import { MISC } from '@/common'
import { getUniqueTimestamps } from '@/utils/Date'
import { Big } from '@/lib/w-big'

import {
  capitec__savings,
  comdirect__giro,
  comdirect__visa,
  fnb__credit_card,
  ing__giro,
  ing__giro__wb,
  lloyds__current,
} from './banks'
import { getCsvSortOrder, isArrayEqual, resolveGetter } from './helper'

export const AVAILABLE_PARSERS: Record<ParserId, Parser> = {
  // South African Banks
  [capitec__savings.id]: capitec__savings,
  [fnb__credit_card.id]: fnb__credit_card,

  // German Banks
  [comdirect__giro.id]: comdirect__giro,
  [comdirect__visa.id]: comdirect__visa,
  [ing__giro.id]: ing__giro,
  [ing__giro__wb.id]: ing__giro__wb,

  // UK Banks
  [lloyds__current.id]: lloyds__current,
}

export const getParserCurrency = (parserId: ParserId) => {
  return AVAILABLE_PARSERS[parserId].currency
}

export const getParserName = (value: ParserId | null): { short: string; long: string; alt: string } => {
  if (!value) {
    return {
      short: 'Unsupported',
      long: 'Unsupported bank format',
      alt: 'Unsupported format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
      alt: `${parser.bankName} / ${parser.accountType}`,
    }
  }

  console.warn(`Invalid parser ID: ${value}`)

  return {
    short: 'Invalid',
    long: 'Invalid parser',
    alt: 'Invalid parser',
  }
}

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

  const getDate = resolveGetter(getters.date)
  const getDescription = resolveGetter(getters.description)
  const getValue = resolveGetter(getters.value)

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
