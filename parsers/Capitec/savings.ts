import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'

export const CapitecSavings = createParser({
  id: ParserId.CAPITEC,

  bankName: 'Capitec',

  accountType: 'Savings',

  currency: Currency.ZAR,

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

  dateGetter: (row) => {
    return row.get('transactionDate')
  },

  descriptionGetter: (row) => {
    return row.get('description')
  },

  valueGetter: (row) => {
    const valIn = row.get('moneyIn')
    const valOut = row.get('moneyOut')
    const valFee = row.get('fee')

    return valIn || valOut || valFee || '0'
  },
})
