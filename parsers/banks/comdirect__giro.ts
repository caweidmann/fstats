import { Currency } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export default createParser({
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

  dateGetter: 'wertstellung',

  descriptionGetter: 'buchungstext',

  valueGetter: (row) => {
    return parseGermanNumber(row.get('umsatzInEur'))
  },
})
