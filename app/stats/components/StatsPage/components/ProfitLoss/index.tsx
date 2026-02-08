'use client'

import { AccountBalance, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'

import type { ParsedContentRow } from '@/types'
import { useIsDarkMode } from '@/hooks'

import { DEMO_PROFIT_LOSS, type ProfitLossData } from '../../demo-data'
import { ui } from './styled'

type ComponentProps = {
  isDemoMode: boolean
  transactions: ParsedContentRow[]
}

const Component = ({ isDemoMode, transactions }: ComponentProps) => {
  const isDarkMode = useIsDarkMode()
  const sx = ui()

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const calculateRealData = (): ProfitLossData => {
    const totalIncome = transactions
      .filter((t) => t.value.gt(0))
      .reduce((sum, t) => sum + t.value.toNumber(), 0)

    const totalExpenses = Math.abs(
      transactions.filter((t) => t.value.lt(0)).reduce((sum, t) => sum + t.value.toNumber(), 0),
    )

    const profit = totalIncome - totalExpenses

    return {
      totalIncome,
      totalExpenses,
      profit,
      taxDeductibleExpenses: totalExpenses, // Simplified - all expenses considered deductible
      estimatedTax: profit * 0.218, // 21.8% tax rate
      taxRate: 21.8,
    }
  }

  const data = isDemoMode ? DEMO_PROFIT_LOSS : calculateRealData()
  const expenseRatio = (data.totalExpenses / data.totalIncome) * 100

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard(isDarkMode ? 'rgba(76, 175, 80, 0.08)' : green[50])}>
          <Box sx={sx.statHeader}>
            <TrendingUp sx={{ color: isDarkMode ? green[300] : green[600], fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Total Income
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: isDarkMode ? green[400] : green[700], fontWeight: 600, mt: 1 }}>
            {formatCurrency(data.totalIncome)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Revenue & other business income
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard(isDarkMode ? 'rgba(244, 67, 54, 0.08)' : red[50])}>
          <Box sx={sx.statHeader}>
            <TrendingDown sx={{ color: isDarkMode ? red[300] : red[600], fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Total Expenses
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: isDarkMode ? red[400] : red[700], fontWeight: 600, mt: 1 }}>
            {formatCurrency(data.totalExpenses)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {expenseRatio.toFixed(1)}% of income
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard(isDarkMode ? 'rgba(33, 150, 243, 0.08)' : blue[50])}>
          <Box sx={sx.statHeader}>
            <AccountBalance sx={{ color: isDarkMode ? blue[300] : blue[600], fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Net Profit
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: isDarkMode ? blue[400] : blue[700], fontWeight: 600, mt: 1 }}>
            {formatCurrency(data.profit)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Income - Expenses
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Component
