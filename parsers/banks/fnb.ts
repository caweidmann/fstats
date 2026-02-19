import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'

export const fnb__credit_card = createParser({
  id: ParserId.FNB_CREDIT_CARD,

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
