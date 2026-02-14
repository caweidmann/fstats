import type { ParsedContentRow, Parser } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { parseGermanNumber } from '@/utils/Number'

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

      const data: ParsedContentRow = {
        date: toSystemDate(umsatztag.trim(), { formatFrom: 'dd.MM.yyyy' }),
        description: buchungstext.trim(),
        value: parseGermanNumber(umsatzInEur.trim()),
        currency: ComdirectVisa.currency,
      }

      return data
    })
  },
}
