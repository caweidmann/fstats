import Big from 'big.js'
import { parse } from 'papaparse'

import type { StatsFile } from '@/types'
import { SupportedFormats } from '@/types-enums'
import { getLocalUserPreferences } from '@/utils/LocalStorage'

import { toDisplayDate } from '../Date'
import { isEqual } from '../Misc'

const capitecHeaders = [
  'Nr',
  'Account',
  'Posting Date',
  'Transaction Date',
  'Description',
  'Original Description',
  'Parent Category',
  'Category',
  'Money In',
  'Money Out',
  'Fee',
  'Balance',
]

export const parseFiles = async (files: StatsFile[]): Promise<StatsFile[]> => {
  const parsedFiles = await Promise.all(files.map(parseFile))
  return parsedFiles
}

export const parseFile = async (file: StatsFile): Promise<StatsFile> => {
  const { locale } = getLocalUserPreferences()
  let parsedType: StatsFile['parsedType'] = SupportedFormats.UNKNOWN
  let parsedContentRows: StatsFile['parsedContentRows']
  const parsedRaw = await parseRaw(file.file)

  if (isEqual(parsedRaw.data[0], capitecHeaders)) {
    parsedType = SupportedFormats.CAPITEC
    parsedContentRows = parsedRaw.data.slice(1).map((row: string[]) => {
      const [
        _nr,
        account,
        postingDate,
        transactionDate,
        description,
        originalDescription,
        parentCategory,
        category,
        moneyIn,
        moneyOut,
        fee,
        balance,
      ] = row

      return {
        date: toDisplayDate(transactionDate, locale, {
          formatTo: 'dd/MM/yyyy HH:SS',
          formatFrom: 'yyyy-MM-dd HH:SS',
        }),
        description,
        value: moneyIn ? Big(moneyIn || 0) : Big(moneyOut || 0),
      }
    })
  }

  return {
    ...file,
    status: 'parsed',
    parsedRaw,
    parsedContentRows,
    parsedType,
  }
}

export const parseRaw = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      // header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        resolve(results)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
