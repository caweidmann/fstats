import type { ParsedContentRow, Parser } from '@/types'
import { ParserId } from '@/types-enums'
import { toDisplayDate } from '@/utils/Date'
import { isEqual, parseGermanNumber } from '@/utils/Misc'
import { Big } from '@/lib/w-big'

export const ComdirectVisa: Parser = {
  id: ParserId.COMDIRECT_VISA,

  bankName: 'Comdirect',

  accountType: 'Visa',

  expectedHeaderRowIndex: 1,

  expectedHeaders: ['Buchungstag', 'Umsatztag', 'Vorgang', 'Referenz', 'Buchungstext', 'Umsatz in EUR', ''],

  detect: (input) => {
    return isEqual(input.data[ComdirectVisa.expectedHeaderRowIndex], ComdirectVisa.expectedHeaders)
  },

  parse: (input, locale) => {
    console.log('rowsToParse', input.data)
    const rowsToParse = input.data
      .slice(ComdirectVisa.expectedHeaderRowIndex + 1)
      .filter((row) => row.length === ComdirectVisa.expectedHeaders.length)

    return rowsToParse.map((row) => {
      const [buchungstag, umsatztag, vorgang, referenz, buchungstext, umsatzInEur, _empty] = row

      const data: ParsedContentRow = {
        date: toDisplayDate(umsatztag, locale, {
          formatTo: 'dd/MM/yyyy',
          formatFrom: 'dd.MM.yyyy',
        }),
        description: buchungstext,
        value: Big(parseGermanNumber(umsatzInEur) || 0),
      }

      return data
    })
  },
}
