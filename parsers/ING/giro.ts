import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { detectMatch, parseGermanNumber } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const IngGiro: Parser = {
  id: ParserId.ING_GIRO,

  bankName: 'ING',

  accountType: 'Giro',

  expectedHeaderRowIndex: 8,

  expectedHeaders: [
    // Headers
    'Buchung',
    'Wertstellungsdatum',
    'Auftraggeber/Empf�nger',
    'Buchungstext',
    'Verwendungszweck',
    'Betrag',
    'W�hrung',
  ],

  detect: (input) => {
    return detectMatch(input, IngGiro)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(IngGiro.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === IngGiro.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        buchung,
        wertstellungsdatum,
        auftraggeberEmpfaenger,
        buchungstext,
        verwendungszweck,
        betrag,
        waehrung,
      ] = row

      const data: ParsedContentRow = {
        date: toDisplayDate(wertstellungsdatum.trim(), locale, { formatTo, formatFrom: 'dd.MM.yyyy' }),
        description: verwendungszweck.trim(),
        value: Big(parseGermanNumber(betrag.trim()) || 0),
      }

      return data
    })
  },
}
