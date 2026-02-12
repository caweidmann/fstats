import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { detectMatch, parseGermanNumber } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const ComdirectVisa: Parser = {
  id: ParserId.COMDIRECT_VISA,

  bankName: 'Comdirect',

  accountType: 'Visa',

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
    console.log('rowsToParse', input.data)
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
        date: toDisplayDate(umsatztag.trim(), locale, { formatTo, formatFrom: 'dd.MM.yyyy' }),
        description: buchungstext.trim(),
        value: Big(parseGermanNumber(umsatzInEur.trim()) || 0),
      }

      return data
    })
  },
}
