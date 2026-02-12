import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const CapitecSavings: Parser = {
  id: ParserId.CAPITEC,

  bankName: 'Capitec',

  accountType: 'Savings',

  expectedHeaderRowIndex: 0,

  expectedHeaders: [
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

  detect: (input) => {
    return isEqual(input.data[CapitecSavings.expectedHeaderRowIndex], CapitecSavings.expectedHeaders)
  },

  parse: (input, locale, dateFormat) => {
    const rowsToParse = input.data
      .slice(CapitecSavings.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === CapitecSavings.expectedHeaders.length)

    return rowsToParse.map((row) => {
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

      const data: ParsedContentRow = {
        date: toDisplayDate(transactionDate, locale, {
          formatTo: dateFormat,
          formatFrom: 'yyyy-MM-dd HH:SS',
        }),
        description,
        value: moneyIn ? Big(moneyIn) : moneyOut ? Big(moneyOut) : fee ? Big(fee) : Big(0),
      }

      return data
    })
  },
}
