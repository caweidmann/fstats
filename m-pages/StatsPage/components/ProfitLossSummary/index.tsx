'use client'

import { AccountBalance, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useFormContext } from 'react-hook-form'

import type { StatsPageForm, Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getProfitLossColors, getStats } from '@/utils/Stats'
import { getParserCurrency } from '@/parsers'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type ProfitLossSummaryProps = {
  transactions: Transaction[]
}

const Component = ({ transactions }: ProfitLossSummaryProps) => {
  const { locale } = useUserPreferences()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme)
  const { watch } = useFormContext<StatsPageForm>()
  const selectedId = watch('selectedId')
  const currency =
    selectedId && selectedId !== 'all' && selectedId !== 'unknown'
      ? getParserCurrency(selectedId)
      : selectedId && selectedId == 'all'
        ? transactions.length
          ? transactions[0].currency
          : Currency.USD // FIXME: This is just hacked, need to do better currency handling here
        : Currency.USD
  const { totalIncome, totalExpense, profit, expenseRatio } = getStats(transactions)
  const totalIncomeDisplay = toFixedLocaleCurrency(totalIncome, currency, locale)
  const totalExpenseDisplay = toFixedLocaleCurrency(totalExpense, currency, locale)
  const profitDisplay = toFixedLocaleCurrency(profit, currency, locale)
  const expenseRatioDisplay = toFixedLocale(expenseRatio, 1, locale, { trimTrailingZeros: true })
  const { incomeTextColor, expensesTextColor, profitTextColor, profitBgColor } = getProfitLossColors(
    Big(profit).gte(0),
    isDarkMode,
  )

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
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

      <Grid size={{ xs: 12, md: 4 }}>
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

      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard(profitBgColor, false)}>
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
    </Grid>
  )
}

export default Component
