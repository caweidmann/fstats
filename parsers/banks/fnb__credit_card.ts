import { Currency } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'

export default createParser({
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

  getters: {
    date: 'date',
    description: 'description',
    value: 'amount',
  },
})
