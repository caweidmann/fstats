'use client'

import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, Card, Divider, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { getCurrencySymbol } from '@/utils/Currency'

import { COL_SPACING, COL1, COL2, COL3, getTransactionsByCategory } from './actions'
import { BreakdownRow } from './components'
import { ui } from './styled'

type CategoryBreakdownProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: CategoryBreakdownProps) => {
  const theme = useTheme()
  const sx = ui(theme)
  const [sortingPref, setSortingPref] = useState<'asc' | 'desc' | 'totalAsc' | 'totalDesc'>('asc')
  const categories = Object.values(getTransactionsByCategory(transactions)).filter(
    (category) => category.code !== 'INC',
  )

  return (
    <Card sx={{ height: '100%' }}>
      <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
        Breakdown by category
      </Typography>

      <Grid container spacing={COL_SPACING} sx={{ mb: 0 }}>
        <Grid size={{ xs: COL1[0], sm: COL1[1] }}>
          <Box sx={sx.tableHeader} onClick={() => setSortingPref(sortingPref === 'asc' ? 'desc' : 'asc')}>
            <Box sx={sx.tableHeaderContent}>
              Category
              {sortingPref === 'asc' ? <ArrowUpward sx={{ fontSize: 13 }} /> : null}
              {sortingPref === 'desc' ? <ArrowDownward sx={{ fontSize: 13 }} /> : null}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: COL2[0], sm: COL2[1] }}>
          <Box
            sx={{ ...sx.tableHeader, justifyContent: 'flex-end' }}
            onClick={() => setSortingPref(sortingPref === 'totalDesc' ? 'totalAsc' : 'totalDesc')}
          >
            <Box sx={sx.tableHeaderContent}>
              Total ({getCurrencySymbol(currency)})
              {sortingPref === 'totalAsc' ? <ArrowUpward sx={{ fontSize: 13 }} /> : null}
              {sortingPref === 'totalDesc' ? <ArrowDownward sx={{ fontSize: 13 }} /> : null}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: COL3[0], sm: COL3[1] }}>
          <Box sx={{ ...sx.tableHeader, justifyContent: 'flex-end', cursor: 'default' }}>%</Box>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 0.5, mb: 1.5 }} />

      {categories.map((category) => {
        return <BreakdownRow key={category.code} category={category} currency={currency} />
      })}
    </Card>
  )
}

export default Component
