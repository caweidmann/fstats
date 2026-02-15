import type { ParsedContentRow, Parser } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const FnbCreditCard: Parser = {
  id: ParserId.FNB,

  bankName: 'FNB',

  accountType: 'Credit Card',

  currency: Currency.ZAR,

  expectedHeaderRowIndex: 4,

  expectedHeaders: [
    // Headers
    'Date',
    'Amount',
    'Balance',
    'Description',
  ],

  detect: (input) => {
    return detectMatch(input, FnbCreditCard)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(FnbCreditCard.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === FnbCreditCard.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        date,
        amount,
        balance,
        description,
      ] = row

      const value = amount.trim()

      const data: ParsedContentRow = {
        date: toSystemDate(date.trim(), { formatFrom: 'yyyy/MM/dd' }),
        description: description.trim(),
        value,
        currency: FnbCreditCard.currency,
        category: Big(value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
      }

      return data
    })
  },
}
