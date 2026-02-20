import { Currency, ParserId } from '@/types-enums'
import { buildExtra, createParser } from '@/utils/Parser'
import { Big } from '@/lib/w-big'

const bankName = 'Lloyds'
const currency = Currency.GBP

export const lloyds__current = createParser({
  id: ParserId.LLOYDS_CURRENT,
  bankName,
  accountType: 'Current Account',
  currency,

  headerRowIndex: 0,

  columns: {
    transactionDate: 'Transaction Date',
    transactionType: 'Transaction Type',
    sortCode: 'Sort Code',
    accountNumber: 'Account Number',
    transactionDescription: 'Transaction Description',
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
      return row.get('transactionDescription')
    },
    value: (row) => {
      const valIn = row.get('creditAmount')
      const valOut = row.get('debitAmount')

      return valIn ? valIn : valOut ? Big(valOut).times(-1).toString() : '0'
    },
    extra: (row) => {
      return buildExtra({
        balance: row.get('balance') || '0',
        transactionType: row.get('transactionType'),
      })
    },
  },
})
