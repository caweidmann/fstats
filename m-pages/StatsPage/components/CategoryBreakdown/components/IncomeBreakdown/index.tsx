'use client'

import { ArrowDownward, ArrowUpward, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Box, Button, Divider, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { getCurrencySymbol } from '@/utils/Currency'

import { COL_SPACING, COL1, COL2, COL3, getSortedCategories, SortingPref } from '../../actions'
import { ui } from '../../styled'
import BreakdownRow from '../BreakdownRow'

type IncomeBreakdownProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: IncomeBreakdownProps) => {
  const theme = useTheme()
  const sx = ui(theme)
  const [sortingPref, setSortingPref] = useState<SortingPref>('totalAsc')
  const [showMore, setShowMore] = useState(false)
  const categories = getSortedCategories(transactions, sortingPref).filter((category) =>
    showMore ? true : category.transactions.length,
  )

  return (
    <>
      <Grid container spacing={COL_SPACING} sx={{ mb: 0 }}>
        <Grid size={{ xs: COL1[0], sm: COL1[1] }}>
          <Box sx={sx.tableHeader} onClick={() => setSortingPref(sortingPref === 'asc' ? 'desc' : 'asc')}>
            <Box sx={sx.tableHeaderContent}>
              Income
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
        return <BreakdownRow key={category.code} category={category} currency={currency} transactions={transactions} />
      })}

      <Button
        variant="outlined"
        size="small"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setShowMore((prev) => !prev)}
      >
        {showMore ? 'Show less' : 'Show more'}{' '}
        {showMore ? (
          <ExpandLess color="secondary" fontSize="small" />
        ) : (
          <ExpandMore color="secondary" fontSize="small" />
        )}
      </Button>
    </>
  )
}

export default Component
