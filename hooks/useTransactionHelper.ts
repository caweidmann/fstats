'use client'

import { difference, isEqual, uniqWith } from 'lodash'

import { SelectOptionBankAccountId, StatsFile, Transaction } from '@/types'
import { DEMO_TRANSACTIONS } from '@/common'
import { getBankAccountId } from '@/utils/Parser'

export const useTransactionHelper = ({
  isDemoMode,
  selectedId,
  files,
}: {
  isDemoMode: boolean
  selectedId: SelectOptionBankAccountId
  files: StatsFile[]
}): {
  transactions: Transaction[]
  duplicates: Transaction[]
} => {
  if (isDemoMode) {
    return {
      transactions: DEMO_TRANSACTIONS,
      duplicates: [],
    }
  }

  const filesForSelectedId =
    selectedId === 'all'
      ? files
      : files.filter((file) => file.parserId && getBankAccountId(file.parserId) === selectedId)

  const allTransactions = filesForSelectedId.flatMap((file) => file.transactions)
  const uniqueTransactions = uniqWith(allTransactions, isEqual)
  const duplicates = difference(allTransactions, uniqueTransactions)

  return {
    transactions: uniqueTransactions,
    duplicates,
  }
}
