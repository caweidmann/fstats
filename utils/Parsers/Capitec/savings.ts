import type { Parser } from '@/types'
import { SupportedParsers } from '@/types-enums'
import { Big } from '@/lib/w-big'

import { toDisplayDate } from '../../Date'

export const CapitecParser: Parser = {
  format: SupportedParsers.CAPITEC,

  name: 'Capitec Bank Savings Account',

  detect: (rows) => {
    if (!rows || rows.length < 2) return false

    const headers = rows[0] || []
    if (headers.length < 12) return false

    // Check for exact Capitec headers
    return (
      headers[0] === 'Nr' &&
      headers[3] === 'Transaction Date' &&
      headers[4] === 'Description' &&
      headers[8] === 'Money In' &&
      headers[9] === 'Money Out'
    )
  },

  parse: (input, locale) => {
    return input.data.slice(1).map((row: string[]) => {
      const [
        nr,
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
        value: moneyIn ? Big(moneyIn) : moneyOut ? Big(moneyOut).times(-1) : fee ? Big(fee).times(-1) : Big(0),
      }
    })
  },
}
