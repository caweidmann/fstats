'use client'

import { parseISO } from 'date-fns'
import { difference, isEqual, uniqWith } from 'lodash'

import {
  DateRange,
  GroupDataByOption,
  SelectOptionBankAccountId,
  StatsFile,
  Transaction,
  TransactionRangeItem,
} from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { DEMO_TRANSACTIONS } from '@/common'
import { getBankAccountId } from '@/utils/Parser'

import { getTransactionsGroupedIntoRanges } from './helper'

export const useTransactionHelper = ({
  isDemoMode,
  selectedId,
  files,
  groupDataBy,
  locale,
  dateFormat,
}: {
  isDemoMode: boolean
  selectedId: SelectOptionBankAccountId
  files: StatsFile[]
  groupDataBy: GroupDataByOption
  locale: UserLocale
  dateFormat: DateFormat
}): {
  transactions: Transaction[]
  duplicates: Transaction[]
  dateRange: DateRange | null
  transactionRangeItems: TransactionRangeItem[]
} => {
  let allTransactions: Transaction[] = []

  if (isDemoMode) {
    allTransactions = DEMO_TRANSACTIONS
  } else {
    const filesForSelectedId =
      selectedId === 'all'
        ? files
        : files.filter((file) => file.parserId && getBankAccountId(file.parserId) === selectedId)
    allTransactions = filesForSelectedId.flatMap((file) => file.transactions)
  }

  if (!allTransactions.length) {
    return {
      transactions: [],
      duplicates: [],
      dateRange: null,
      transactionRangeItems: [],
    }
  }

  const transactions = uniqWith(allTransactions, isEqual)
  const duplicates = difference(allTransactions, transactions)
  const transactionsSortedByDate = transactions.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
  const earliestTransaction = transactionsSortedByDate[0]
  const latestTransaction = transactionsSortedByDate[transactionsSortedByDate.length - 1]
  const dateRange: DateRange = {
    start: earliestTransaction ? parseISO(earliestTransaction.date) : new Date(),
    end: latestTransaction ? parseISO(latestTransaction.date) : new Date(),
  }
  const transactionRangeItems = getTransactionsGroupedIntoRanges({
    groupDataBy,
    dateRange,
    transactions,
    locale,
    dateFormat,
  })

  return {
    transactions,
    duplicates,
    dateRange,
    transactionRangeItems,
  }
}
