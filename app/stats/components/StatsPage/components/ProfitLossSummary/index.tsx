'use client'

import { AccountBalance, TrendingDown, TrendingUp } from '@mui/icons-material'
import { Box, Grid, Typography } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { useFormContext } from 'react-hook-form'

import type { ParsedContentRow, StatsPageForm } from '@/types'
import { Currency } from '@/types-enums'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getParserCurrency } from '@/parsers'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type ProfitLossSummaryProps = {
  transactions: ParsedContentRow[]
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
  const totalIncome = transactions.reduce((acc, transaction) => {
    const value = Big(transaction.value)
    return acc.plus(value.gt(0) ? value : Big(0))
  }, Big(0))
  const totalExpenses = transactions.reduce((acc, transaction) => {
    const value = Big(transaction.value)
    return acc.plus(value.lt(0) ? value.abs() : Big(0))
  }, Big(0))
  const profit = totalIncome.minus(totalExpenses)
  const expenseRatio = totalIncome.gt(0) ? totalExpenses.div(totalIncome).times(100) : Big(0)
  const totalIncomeDisplay = toFixedLocaleCurrency(totalIncome.toString(), currency, locale, {
    rawValue: totalIncome.toString(),
    isFractional: false,
    currencyFormat: 'symbol',
  })
  const totalExpensesDisplay = toFixedLocaleCurrency(totalExpenses.toString(), currency, locale, {
    rawValue: totalExpenses.toString(),
    isFractional: false,
    currencyFormat: 'symbol',
  })
  const profitDisplay = toFixedLocaleCurrency(profit.toString(), currency, locale, {
    rawValue: profit.toString(),
    isFractional: false,
    currencyFormat: 'symbol',
  })
  const expenseRatioDisplay = toFixedLocale(expenseRatio.toString(), 1, locale, { trimTrailingZeros: true })
  const profitColor = profit.gte(0)
    ? isDarkMode
      ? 'rgba(76, 175, 80, 0.08)'
      : green[50]
    : isDarkMode
      ? 'rgba(244, 67, 54, 0.08)'
      : red[50]

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard('transparent')}>
          <Box sx={sx.statHeader}>
            <TrendingUp color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Total Income
            </Typography>
          </Box>
          <Typography color="primary" variant="h4" sx={{ fontWeight: 600, mt: 1 }}>
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
            <TrendingDown sx={{ color: isDarkMode ? red[300] : red[600], fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Total Expenses
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: isDarkMode ? red[400] : red[700], fontWeight: 600, mt: 1 }}>
            {totalExpensesDisplay}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {expenseRatioDisplay}% of income
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={sx.statCard(profitColor, false)}>
          <Box sx={sx.statHeader}>
            <AccountBalance color={profit.gte(0) ? 'success' : 'error'} sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              Net Profit
            </Typography>
          </Box>
          <Typography variant="h4" color={profit.gte(0) ? 'success' : 'error'} sx={{ fontWeight: 600, mt: 1 }}>
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
