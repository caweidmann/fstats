import type { Parser, Transaction } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { parseGermanNumber } from '@/utils/Number'
import { Big } from '@/lib/w-big'

export const ComdirectVisa: Parser = {
  id: ParserId.COMDIRECT_VISA,

  bankName: 'Comdirect',

  accountType: 'Visa',

  currency: Currency.EUR,

  expectedHeaderRowIndex: 1,

  expectedHeaders: [
    // Headers
    'Buchungstag',
    'Umsatztag',
    'Vorgang',
    'Referenz',
    'Buchungstext',
    'Umsatz in EUR',
    '',
  ],

  detect: (input) => {
    return detectMatch(input, ComdirectVisa)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(ComdirectVisa.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === ComdirectVisa.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        buchungstag,
        umsatztag,
        vorgang,
        referenz,
        buchungstext,
        umsatzInEur,
        _empty,
      ] = row

      const value = parseGermanNumber(umsatzInEur.trim())

      const data: Transaction = {
        date: toSystemDate(umsatztag.trim(), { formatFrom: 'dd.MM.yyyy' }),
        description: buchungstext.trim(),
        value,
        currency: ComdirectVisa.currency,
        category: Big(value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
      }

      return data
    })
  },
}
