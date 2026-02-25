'use client'

import { AccountBalance, Percent, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Box, Card, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getProfitLossColors, getStats } from '@/utils/Stats'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type ProfitLossSummaryProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: ProfitLossSummaryProps) => {
  const { locale } = useUserPreferences()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme)
  const { totalIncome, totalExpense, profit, expenseRatio, profitMargin } = getStats(transactions)
  const totalIncomeDisplay = toFixedLocaleCurrency(totalIncome, currency, locale)
  const totalExpenseDisplay = toFixedLocaleCurrency(totalExpense, currency, locale)
  const profitDisplay = toFixedLocaleCurrency(profit, currency, locale)
  const expenseRatioDisplay = toFixedLocale(expenseRatio, 1, locale, { trimTrailingZeros: true })
  const profitMarginDisplay = toFixedLocale(profitMargin, 1, locale, { trimTrailingZeros: true })
  const { incomeTextColor, expensesTextColor, profitTextColor, profitBgColor } = getProfitLossColors(
    Big(profit).gte(0),
    isDarkMode,
  )

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.statCard('transparent')}>
            <Box sx={sx.statHeader}>
              <TrendingUp sx={{ color: incomeTextColor, fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                Total Income
              </Typography>
            </Box>
            <Typography color="primary" variant="h4" sx={{ color: incomeTextColor, fontWeight: 600, mt: 1 }}>
              {totalIncomeDisplay}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Revenue & other business income
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.statCard('transparent')}>
            <Box sx={sx.statHeader}>
              <TrendingDown sx={{ color: expensesTextColor, fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                Total Expenses
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: expensesTextColor, fontWeight: 600, mt: 1 }}>
              {totalExpenseDisplay}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {expenseRatioDisplay}% of income
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.profitCard(profitBgColor)}>
            <Box sx={sx.statHeader}>
              <AccountBalance sx={{ color: profitTextColor, fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                Net Profit
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: profitTextColor, fontWeight: 600, mt: 1 }}>
              {profitDisplay}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Income - Expenses
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 2.25 }}>
          <Box sx={sx.profitCard(profitBgColor)}>
            <Box sx={sx.statHeader}>
              <Percent sx={{ color: profitTextColor, fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                Profit Margin
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: profitTextColor, fontWeight: 600, mt: 1 }}>
              {profitMarginDisplay}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Profit as % of income
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Component
