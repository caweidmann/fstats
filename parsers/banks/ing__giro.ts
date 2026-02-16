import { Currency } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export default createParser({
  bankName: 'ING',

  accountType: 'Giro',

  currency: Currency.EUR,

  headerRowIndex: 8,

  columns: {
    buchung: 'Buchung',
    wertstellungsdatum: 'Wertstellungsdatum',
    auftraggeberEmpfaenger: 'Auftraggeber/Empf�nger',
    buchungstext: 'Buchungstext',
    verwendungszweck: 'Verwendungszweck',
    betrag: 'Betrag',
    waehrung: 'W�hrung',
  } as const,

  dateFormat: 'dd.MM.yyyy',

  dateGetter: 'wertstellungsdatum',

  descriptionGetter: 'verwendungszweck',

  valueGetter: (row) => {
    return parseGermanNumber(row.get('betrag'))
  },
})
