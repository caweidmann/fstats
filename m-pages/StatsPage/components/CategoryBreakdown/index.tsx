import { Box, Card, Typography } from '@mui/material'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'

import { ExpensesBreakdown, IncomeBreakdown } from './components'

type CategoryBreakdownProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: CategoryBreakdownProps) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
        Breakdown by category
      </Typography>

      <Box sx={{ mb: 4 }}>
        <IncomeBreakdown transactions={transactions} currency={currency} />
      </Box>

      <ExpensesBreakdown transactions={transactions} currency={currency} />
    </Card>
  )
}

export default Component
