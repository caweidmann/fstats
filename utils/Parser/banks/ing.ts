import { Currency, ParserId } from '@/types-enums'
import { parseGermanNumber } from '@/utils/Number'
import { createParser } from '@/utils/Parser'

const bankName = 'ING'
const currency = Currency.EUR

export const ing__giro = createParser({
  id: ParserId.ING_GIRO,
  bankName,
  accountType: 'Giro',
  currency,

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
    description: 'auftraggeberEmpfaenger',
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
  },
})

export const ing__giro__wb = createParser({
  id: ParserId.ING_GIRO__WB,
  bankName,
  accountType: 'Giro',
  currency,

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
    description: 'auftraggeberEmpfaenger',
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
  },
})
