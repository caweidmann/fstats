'use client'

import { Box, Card, LinearProgress, Typography } from '@mui/material'

import type { ParsedContentRow } from '@/types'
import { Big } from '@/lib/w-big'

import { DEMO_TRANSACTIONS } from '../../demo-data'
import { getCategoryBreakdownData } from './actions'
import { ui } from './styled'

type ComponentProps = {
  isDemoMode: boolean
  transactions: ParsedContentRow[]
}

const Component = ({ isDemoMode, transactions }: ComponentProps) => {
  const sx = ui()

  const categoryData = isDemoMode
    ? getCategoryBreakdownData(DEMO_TRANSACTIONS.map((t) => ({ ...t, value: Big(t.amount), currency: 'EUR' })))
    : getCategoryBreakdownData(transactions)

  const hasData = categoryData.length > 0

  return (
    <Card sx={sx.card}>
      <Typography variant="h6" sx={sx.title}>
        Expense Breakdown by Category
      </Typography>
      {hasData ? (
        <Box sx={sx.contentContainer}>
          {categoryData.map((category, index) => (
            <Box key={category.name} sx={sx.categoryRow}>
              <Box sx={sx.categoryHeader}>
                <Box sx={sx.categoryInfo}>
                  <Box sx={sx.colorIndicator(category.color)} />
                  <Typography variant="body2" sx={sx.categoryName}>
                    {category.name}
                  </Typography>
                </Box>
                <Box sx={sx.amountInfo}>
                  <Typography variant="body2" sx={sx.amount}>
                    €{category.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="caption" sx={sx.percentage}>
                    {category.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={category.percentage} sx={sx.progressBar(category.color)} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={sx.emptyState}>
          <Typography variant="body2" color="text.secondary">
            No expense data available
          </Typography>
        </Box>
      )}
    </Card>
  )
}

export default Component
