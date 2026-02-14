import type { ParsedContentRow, Parser } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { parseGermanNumber } from '@/utils/Number'
import { Big } from '@/lib/w-big'

export const ComdirectGiro: Parser = {
  id: ParserId.COMDIRECT_GIRO,

  bankName: 'Comdirect',

  accountType: 'Giro',

  currency: Currency.EUR,

  expectedHeaderRowIndex: 1,

  expectedHeaders: [
    // Headers
    'Buchungstag',
    'Wertstellung (Valuta)',
    'Vorgang',
    'Buchungstext',
    'Umsatz in EUR',
    '',
  ],

  detect: (input) => {
    return detectMatch(input, ComdirectGiro)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(ComdirectGiro.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === ComdirectGiro.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        buchungstag,
        wertstellung,
        vorgang,
        buchungstext,
        umsatzInEur,
        _empty,
      ] = row

      const value = parseGermanNumber(umsatzInEur.trim())

      const data: ParsedContentRow = {
        date: toSystemDate(wertstellung.trim(), { formatFrom: 'dd.MM.yyyy' }),
        description: buchungstext.trim(),
        value,
        currency: ComdirectGiro.currency,
        category: Big(value).gte(0) ? 'income' : 'expense', // FIXME: Add cats parser
      }

      return data
    })
  },
}
