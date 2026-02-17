import { Currency } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export default createParser({
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

  getters: {
    date: 'umsatztag',
    description: 'buchungstext',
    value: (row) => {
      return parseGermanNumber(row.get('umsatzInEur'))
    },
  },
})
