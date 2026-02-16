import { Currency, ParserId } from '@/types-enums'
import { createParser } from '@/utils/CsvParser'
import { Big } from '@/lib/w-big'

export const LloydsCurrent = createParser({
  id: ParserId.LLOYDS_CURRENT,

  bankName: 'Lloyds',

  accountType: 'Current Account',

  currency: Currency.GBP,

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

  dateGetter: (row) => {
    return row.get('transactionDate')
  },

  descriptionGetter: (row) => {
    return row.get('transactionDescription')
  },

  valueGetter: (row) => {
    const valIn = row.get('creditAmount')
    const valOut = row.get('debitAmount')

    return valIn ? valIn : valOut ? Big(valOut).times(-1).toString() : '0'
  },
})
