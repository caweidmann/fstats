import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/Parser'

const bankName = 'FNB'
const currency = Currency.ZAR

export const fnb__credit_card = createParser({
  id: ParserId.FNB_CREDIT_CARD,
  bankName,
  accountType: 'Credit Card',
  currency,

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
