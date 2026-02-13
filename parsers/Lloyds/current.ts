import type { ParsedContentRow, Parser } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const LloydsCurrent: Parser = {
  id: ParserId.LLOYDS_CURRENT,

  bankName: 'Lloyds',

  accountType: 'Current Account',

  currency: Currency.GBP,

  expectedHeaderRowIndex: 0,

  expectedHeaders: [
    // Headers
    'Transaction Date',
    'Transaction Type',
    'Sort Code',
    'Account Number',
    'Transaction Description',
    'Debit Amount',
    'Credit Amount',
    'Balance',
  ],

  detect: (input) => {
    return detectMatch(input, LloydsCurrent)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(LloydsCurrent.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === LloydsCurrent.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        transactionDate,
        transactionType,
        sortCode,
        accountNumber,
        transactionDescription,
        debitAmount,
        creditAmount,
        balance,
      ] = row

      const valIn = creditAmount.trim()
      const valOut = debitAmount.trim()

      const data: ParsedContentRow = {
        date: toSystemDate(transactionDate.trim(), { formatFrom: 'dd/MM/yyyy' }),
        description: transactionDescription.trim(),
        value: valIn ? Big(valIn) : valOut ? Big(valOut).times(-1) : Big(0),
        currency: LloydsCurrent.currency,
      }

      return data
    })
  },
}
