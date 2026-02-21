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
  const transactionsGrouped = Object.values(getTransactionsGroupedByCategory(transactions))
  const { totalIncome, totalExpense } = getStats(transactions)
  const incomeTransactionsGrouped = transactionsGrouped.filter((parentCategory) =>
    Object.keys(INCOME_CATEGORIES).includes(parentCategory.code),
  )
  const expenseTransactionsGrouped = transactionsGrouped.filter((parentCategory) =>
    Object.keys(EXPENSE_CATEGORIES).includes(parentCategory.code),
  )

  return (
    <Card sx={{ height: '100%' }}>
      <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
        Breakdown by category
      </Typography>

      <Box sx={{ mb: 4 }}>
        <IncomeBreakdown
          transactionsGrouped={incomeTransactionsGrouped}
          total={totalIncome}
          transactions={transactions}
          currency={currency}
        />
      </Box>

      <ExpensesBreakdown
        transactionsGrouped={expenseTransactionsGrouped}
        total={totalExpense}
        transactions={transactions}
        currency={currency}
      />
    </Card>
  )
}

export default Component
