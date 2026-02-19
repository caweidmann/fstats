import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'

const bankName = 'Capitec'
const currency = Currency.ZAR

export const capitec__savings = createParser({
  id: ParserId.CAPITEC_SAVINGS,
  bankName,
  accountType: 'Savings',
  currency,

  headerRowIndex: 0,

  columns: {
    nr: 'Nr',
    account: 'Account',
    postingDate: 'Posting Date',
    transactionDate: 'Transaction Date',
    description: 'Description',
    originalDescription: 'Original Description',
    parentCategory: 'Parent Category',
    category: 'Category',
    moneyIn: 'Money In',
    moneyOut: 'Money Out',
    fee: 'Fee',
    balance: 'Balance',
  } as const,

  dateFormat: 'yyyy-MM-dd HH:mm',

  getters: {
    date: 'transactionDate',
    description: 'description',
    value: (row) => {
      const valIn = row.get('moneyIn')
      const valOut = row.get('moneyOut')
      const valFee = row.get('fee')

      return valIn || valOut || valFee || '0'
    },
  },
})
