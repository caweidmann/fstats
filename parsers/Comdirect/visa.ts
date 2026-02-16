import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export const ComdirectVisa = createParser({
  id: ParserId.COMDIRECT_VISA,

  bankName: 'Comdirect',

  accountType: 'Visa',

  currency: Currency.EUR,

  headerRowIndex: 1,

  columns: {
    buchungstag: 'Buchungstag',
    umsatztag: 'Umsatztag',
    vorgang: 'Vorgang',
    referenz: 'Referenz',
    buchungstext: 'Buchungstext',
    umsatzInEur: 'Umsatz in EUR',
    empty: '',
  } as const,

  dateFormat: 'dd.MM.yyyy',

  dateGetter: (row) => {
    return row.get('umsatztag')
  },

  descriptionGetter: (row) => {
    return row.get('buchungstext')
  },

  valueGetter: (row) => {
    return parseGermanNumber(row.get('umsatzInEur'))
  },
})
