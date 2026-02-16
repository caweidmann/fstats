import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export const ComdirectGiro = createParser({
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

  dateGetter: (row) => {
    return row.get('wertstellung')
  },

  descriptionGetter: (row) => {
    return row.get('buchungstext')
  },

  valueGetter: (row) => {
    return parseGermanNumber(row.get('umsatzInEur'))
  },
})
