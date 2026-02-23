import { BankAccountId, Currency, ParserId } from '@/types-enums'
import { parseGermanNumber } from '@/utils/Number'
import { buildExtra, createParser } from '@/utils/Parser'

const bankName = 'ING'
const currency = Currency.EUR

export const ing__giro = createParser({
  id: ParserId.ING_GIRO,
  bankAccountId: BankAccountId.ING_GIRO,
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
    date: (row) => {
      return row.get('wertstellungsdatum')
    },
    description: (row) => {
      return row.get('auftraggeberEmpfaenger')
    },
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
    extra: (row) => {
      return buildExtra({
        reference: row.get('verwendungszweck'),
        transactionType: row.get('buchungstext'),
      })
    },
  },
})

export const ing__giro__wb = createParser({
  id: ParserId.ING_GIRO__WB,
  bankAccountId: BankAccountId.ING_GIRO,
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
    date: (row) => {
      return row.get('wertstellungsdatum')
    },
    description: (row) => {
      return row.get('auftraggeberEmpfaenger')
    },
    value: (row) => {
      return parseGermanNumber(row.get('betrag'))
    },
    extra: (row) => {
      return buildExtra({
        balance: parseGermanNumber(row.get('saldo')) || '0',
        reference: row.get('verwendungszweck'),
        transactionType: row.get('buchungstext'),
      })
    },
  },
})
