import { BankAccountId, Currency, ParserId } from '@/types-enums'
import { buildExtra, createParser } from '@/utils/Parser'
import { Big } from '@/lib/w-big'

const bankName = 'Capitec'
const currency = Currency.ZAR

export const capitec__savings = createParser({
  id: ParserId.CAPITEC_SAVINGS,
  bankAccountId: BankAccountId.CAPITEC_SAVINGS,
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
    date: (row) => {
      return row.get('transactionDate')
    },
    description: (row) => {
      return row.get('description')
    },
    value: (row) => {
      const valIn = row.get('moneyIn')
      const valOut = row.get('moneyOut')
      const valFee = row.get('fee')

      return valIn || valOut || valFee || '0'
    },
    extra: (row) => {
      return buildExtra({
        parentCategory: row.get('parentCategory'),
        category: row.get('category'),
        balance: row.get('balance') || '0',
      })
    },
  },
})

export const capitec__savings__alt = createParser({
  id: ParserId.CAPITEC_SAVINGS__ALT,
  bankAccountId: BankAccountId.CAPITEC_SAVINGS,
  bankName,
  accountType: 'Savings',
  currency,

  headerRowIndex: 1,

  columns: {
    sequenceNumber: 'Sequence Number',
    account: 'Account',
    postingDate: 'Posting Date',
    transactionDate: 'Transaction Date',
    statementDescription: 'Statement Description',
    longDescription: 'Long Description',
    parentCategory: 'Parent Category',
    subcategory: 'Sub-category',
    debitAmount: 'Debit Amount',
    creditAmount: 'Credit Amount',
    balance: 'Balance',
  } as const,

  dateFormat: 'dd/MM/yyyy',

  getters: {
    date: (row) => {
      return row.get('transactionDate')
    },
    description: (row) => {
      return row.get('statementDescription')
    },
    value: (row) => {
      const valIn = row.get('creditAmount')
      const valOut = row.get('debitAmount')

      return valIn ? valIn : valOut ? Big(valOut).times(-1).toString() : '0'
    },
    extra: (row) => {
      return buildExtra({
        parentCategory: row.get('parentCategory'),
        category: row.get('subcategory'),
        balance: row.get('balance') || '0',
      })
    },
  },
})
