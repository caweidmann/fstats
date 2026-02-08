'use client'

import { AccountBalance, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { blue, green, red } from '@mui/material/colors'

import { useIsDarkMode } from '@/hooks'

import { ui } from './styled'

type ProfitLossData = {
  totalIncome: number
  totalExpenses: number
  profit: number
  taxDeductibleExpenses: number
  estimatedTax: number
  taxRate: number
}

// Dummy data
const DUMMY_DATA: ProfitLossData = {
  totalIncome: 45200.0,
  totalExpenses: 18650.32,
  profit: 26549.68,
  taxDeductibleExpenses: 18650.32,
  estimatedTax: 5789.45,
  taxRate: 21.8,
}

const Component = () => {
  const isDarkMode = useIsDarkMode()
  const sx = ui()

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const expenseRatio = (DUMMY_DATA.totalExpenses / DUMMY_DATA.totalIncome) * 100

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
            {formatCurrency(DUMMY_DATA.totalIncome)}
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
            {formatCurrency(DUMMY_DATA.totalExpenses)}
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
            {formatCurrency(DUMMY_DATA.profit)}
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
