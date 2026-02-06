import type { Parser } from '@/types'
import { Big } from '@/lib/w-big'

import { toDisplayDate } from '../../Date'

export const CapitecParser: Parser = {
  headers: [
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
  ],

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
        value: moneyIn ? Big(moneyIn || 0) : Big(moneyOut || 0),
      }
    })
  },
}
