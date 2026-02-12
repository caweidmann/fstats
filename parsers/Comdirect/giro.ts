import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { isEqual, parseGermanNumber } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const ComdirectGiro: Parser = {
  id: ParserId.COMDIRECT_GIRO,

  bankName: 'Comdirect',

  accountType: 'Giro',

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
    return isEqual(input.data[ComdirectGiro.expectedHeaderRowIndex], ComdirectGiro.expectedHeaders)
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

      const data: ParsedContentRow = {
        date: toDisplayDate(wertstellung.trim(), locale, { formatTo, formatFrom: 'dd.MM.yyyy' }),
        description: buchungstext.trim(),
        value: Big(parseGermanNumber(umsatzInEur.trim()) || 0),
      }

      return data
    })
  },
}
