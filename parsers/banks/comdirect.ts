import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export const comdirect__giro = createParser({
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

export const comdirect__visa = createParser({
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

  getters: {
    date: 'umsatztag',
    description: 'buchungstext',
    value: (row) => {
      return parseGermanNumber(row.get('umsatzInEur'))
    },
  },
})
