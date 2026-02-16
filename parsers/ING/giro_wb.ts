import type { Parser, Transaction } from '@/types'
import { Currency, ParserId } from '@/types-enums'
import { toSystemDate } from '@/utils/Date'
import { detectMatch } from '@/utils/Misc'
import { parseGermanNumber } from '@/utils/Number'
import { Big } from '@/lib/w-big'

export const IngGiroWb: Parser = {
  id: ParserId.ING_GIRO_WB,

  bankName: 'ING',

  accountType: 'Giro', // with account balance

  currency: Currency.EUR,

  expectedHeaderRowIndex: 9,

  expectedHeaders: [
    // Headers
    'Buchung',
    'Wertstellungsdatum',
    'Auftraggeber/Empf�nger',
    'Buchungstext',
    'Verwendungszweck',
    'Saldo',
    'W�hrung',
    'Betrag',
    'W�hrung',
  ],

  detect: (input) => {
    return detectMatch(input, IngGiroWb)
  },

  parse: (input, locale, formatTo) => {
    const rowsToParse = input.data
      .slice(IngGiroWb.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === IngGiroWb.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [
        // Headers
        buchung,
        wertstellungsdatum,
        auftraggeberEmpfaenger,
        buchungstext,
        verwendungszweck,
        saldo,
        waehrung1,
        betrag,
        waehrung2,
      ] = row

      const value = parseGermanNumber(betrag.trim())

      const data: Transaction = {
        date: toSystemDate(wertstellungsdatum.trim(), { formatFrom: 'dd.MM.yyyy' }),
        description: verwendungszweck.trim(),
        value,
        currency: IngGiroWb.currency,
        category: Big(value).gte(0) ? 'Income' : 'Expense', // FIXME: Add cats parser
      }

      return data
    })
  },
}
