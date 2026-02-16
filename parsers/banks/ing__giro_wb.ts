import { Currency } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export default createParser({
  bankName: 'ING',

  accountType: 'Giro', // with account balance

  currency: Currency.EUR,

  headerRowIndex: 9,

  columns: {
    buchung: 'Buchung',
    wertstellungsdatum: 'Wertstellungsdatum',
    auftraggeberEmpfaenger: 'Auftraggeber/Empf�nger',
    buchungstext: 'Buchungstext',
    verwendungszweck: 'Verwendungszweck',
    saldo: 'Saldo',
    waehrung1: 'W�hrung',
    betrag: 'Betrag',
    waehrung2: 'W�hrung',
  } as const,

  dateFormat: 'dd.MM.yyyy',

  dateGetter: 'wertstellungsdatum',

  descriptionGetter: 'verwendungszweck',

  valueGetter: (row) => {
    return parseGermanNumber(row.get('betrag'))
  },
})
