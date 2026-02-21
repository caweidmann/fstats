import { Box, Card, Typography } from '@mui/material'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { getStats } from '@/utils/Stats'

import { getTransactionsGroupedByCategory } from './actions'
import { ExpensesBreakdown, IncomeBreakdown } from './components'

type CategoryBreakdownProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: CategoryBreakdownProps) => {
  const { totalIncome, totalExpense } = getStats(transactions)
  const groupedTransactions = Object.values(getTransactionsGroupedByCategory(transactions))
  const income = groupedTransactions.filter((cat) => Object.keys(INCOME_CATEGORIES).includes(cat.code))
  const expenses = groupedTransactions.filter((cat) => Object.keys(EXPENSE_CATEGORIES).includes(cat.code))

  return (
    <Card sx={{ height: '100%' }}>
      <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
        Breakdown by category
      </Typography>

      <Box sx={{ mb: 4 }}>
        <IncomeBreakdown transactionsGrouped={income} total={totalIncome} currency={currency} />
      </Box>

      <ExpensesBreakdown transactionsGrouped={expenses} total={totalExpense} currency={currency} />
    </Card>
  )
}

export default Component
