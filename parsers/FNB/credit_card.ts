import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { isEqual } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const FnbCreditCard: Parser = {
  id: ParserId.FNB,

  bankName: 'FNB',

  accountType: 'Credit Card',

  expectedHeaderRowIndex: 4,

  expectedHeaders: [
    // Headers
    'Date',
    'Amount',
    'Balance',
    'Description',
  ],

  detect: (input) => {
    console.log('input', input)
    return isEqual(input.data[FnbCreditCard.expectedHeaderRowIndex], FnbCreditCard.expectedHeaders)
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

      const data: ParsedContentRow = {
        date: toDisplayDate(date.trim(), locale, { formatTo, formatFrom: 'yyyy/MM/dd' }),
        description: description.trim(),
        value: Big(amount.trim()),
      }

      return data
    })
  },
}
