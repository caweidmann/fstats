import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { parseGermanNumber } from '@/utils/Number'

export const ing__giro = createParser({
  id: ParserId.ING_GIRO,

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

  getters: {
    date: 'wertstellungsdatum',
    description: 'verwendungszweck',
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
  },
})

export const ing__giro_wb = createParser({
  id: ParserId.ING_GIRO_WB,

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

  getters: {
    date: 'wertstellungsdatum',
    description: 'verwendungszweck',
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
  },
})
