import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export default createParser({
  id: ParserId.COMDIRECT_GIRO,

  bankName: 'Comdirect',

  accountType: 'Giro',

  currency: Currency.EUR,

  headerRowIndex: 1,

  columns: {
    buchungstag: 'Buchungstag',
    wertstellung: 'Wertstellung (Valuta)',
    vorgang: 'Vorgang',
    buchungstext: 'Buchungstext',
    umsatzInEur: 'Umsatz in EUR',
    empty: '',
  } as const,

  dateFormat: 'dd.MM.yyyy',

  getters: {
    date: 'wertstellung',
    description: 'buchungstext',
    value: (row) => {
      return parseGermanNumber(row.get('umsatzInEur'))
    },
  },
})
