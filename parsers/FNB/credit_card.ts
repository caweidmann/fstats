import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'

export const FnbCreditCard = createParser({
  id: ParserId.FNB,

  bankName: 'FNB',

  accountType: 'Credit Card',

  currency: Currency.ZAR,

  headerRowIndex: 4,

  columns: {
    date: 'Date',
    amount: 'Amount',
    balance: 'Balance',
    description: 'Description',
  } as const,

  dateFormat: 'yyyy/MM/dd',

  dateGetter: (row) => {
    return row.get('date')
  },

  descriptionGetter: (row) => {
    return row.get('description')
  },

  valueGetter: (row) => {
    return row.get('amount') || '0'
  },
})
