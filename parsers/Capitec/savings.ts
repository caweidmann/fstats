import type { ParsedContentRow, Parser } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const CapitecSavings: Parser = {
  id: ParserId.CAPITEC,

  bankName: 'Capitec',

  accountType: 'Savings',

  currency: Currency.ZAR,

  expectedHeaderRowIndex: 0,

  expectedHeaders: [
    // Headers
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
    return detectMatch(input, CapitecSavings)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(CapitecSavings.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === CapitecSavings.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
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

      const valIn = moneyIn.trim()
      const valOut = moneyOut.trim()
      const valFee = fee.trim()

      const value = valIn ? valIn : valOut ? valOut : valFee ? valFee : '0'

      const data: ParsedContentRow = {
        date: toSystemDate(transactionDate.trim(), { formatFrom: 'yyyy-MM-dd HH:SS' }),
        description: description.trim(),
        value,
        currency: CapitecSavings.currency,
        category: Big(value).gte(0) ? 'income' : 'expense', // FIXME: Add cats parser
      }

      return data
    })
  },
}
