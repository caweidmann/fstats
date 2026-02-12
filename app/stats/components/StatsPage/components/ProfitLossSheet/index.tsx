'use client'

import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Fragment, useState } from 'react'

import type { ParsedContentRow } from '@/types'
import { useUserPreferences } from '@/hooks'

import { DEMO_TRANSACTIONS, type TransactionRow } from '../../demo-data'
import { transformDemoTransactions, transformRealTransactions } from './actions'
import { ui } from './styled'
import type { PeriodType } from './types'

type ComponentProps = {
  isDemoMode: boolean
  transactions: ParsedContentRow[]
}

const Component = ({ isDemoMode, transactions }: ComponentProps) => {
  const { dateFormat } = useUserPreferences()
  const sx = ui()
  const [periodType, setPeriodType] = useState<PeriodType>('monthly')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Income']))

  const plData = isDemoMode
    ? transformDemoTransactions(DEMO_TRANSACTIONS as TransactionRow[], periodType, dateFormat)
    : transformRealTransactions(transactions, periodType, dateFormat)

  const formatCurrency = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return amount < 0 ? `-$${formatted}` : `$${formatted}`
  }

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle)
    } else {
      newExpanded.add(sectionTitle)
    }
    setExpandedSections(newExpanded)
  }

  const getDateRange = () => {
    if (plData.periods.length === 0) return ''
    const first = plData.periods[0]
    const last = plData.periods[plData.periods.length - 1]

    if (periodType === 'monthly') {
      return `${first} - ${last}`
    } else {
      const lastEnd = last.split(' - ')[1] || last
      return `${first.split(' - ')[0]} - ${lastEnd}`
    }
  }

  return (
    <Paper sx={sx.container}>
      <Box sx={sx.header}>
        <Box sx={sx.titleSection}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Profit and Loss Statement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getDateRange()}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as PeriodType)}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer sx={sx.tableContainer}>
        <Table sx={sx.table}>
          <TableHead>
            <TableRow>
              <TableCell sx={sx.headerCell}>Category</TableCell>
              {plData.periods.map((period) => (
                <TableCell key={period} sx={sx.headerCell}>
                  {period}
                </TableCell>
              ))}
              <TableCell sx={sx.headerCell}>TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plData.sections.map((section) => {
              const isExpanded = expandedSections.has(section.title)

              return (
                <Fragment key={section.title}>
                  {/* Section Header */}
                  <TableRow sx={sx.sectionHeaderRow}>
                    <TableCell sx={{ ...sx.nameCell, ...sx.toggleButton }} onClick={() => toggleSection(section.title)}>
                      {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                      {section.title}
                    </TableCell>
                    {plData.periods.map((period) => (
                      <TableCell key={period} sx={sx.amountCell}>
                        {/* Empty for section headers */}
                      </TableCell>
                    ))}
                    <TableCell sx={sx.amountCell}>{/* Empty for section headers */}</TableCell>
                  </TableRow>

                  {/* Category Rows */}
                  {isExpanded &&
                    section.categories.map((category) => (
                      <TableRow key={category.name} sx={sx.categoryRow(category.isSubItem)}>
                        <TableCell sx={sx.nameCell}>{category.name}</TableCell>
                        {plData.periods.map((period) => (
                          <TableCell key={period} sx={sx.amountCell}>
                            {formatCurrency(category.values[period] || 0)}
                          </TableCell>
                        ))}
                        <TableCell sx={sx.amountCell}>{formatCurrency(category.total)}</TableCell>
                      </TableRow>
                    ))}

                  {/* Section Total */}
                  <TableRow sx={sx.totalRow}>
                    <TableCell sx={sx.nameCell}>Total {section.title}</TableCell>
                    {plData.periods.map((period) => {
                      const total = section.categories.reduce((sum, cat) => sum + (cat.values[period] || 0), 0)
                      return (
                        <TableCell key={period} sx={sx.amountCell}>
                          {formatCurrency(total)}
                        </TableCell>
                      )
                    })}
                    <TableCell sx={sx.amountCell}>{formatCurrency(section.sectionTotal)}</TableCell>
                  </TableRow>
                </Fragment>
              )
            })}

            {/* Net Profit */}
            <TableRow sx={sx.netProfitRow}>
              <TableCell sx={sx.nameCell}>NET PROFIT</TableCell>
              {plData.periods.map((period) => (
                <TableCell key={period} sx={sx.amountCell}>
                  {formatCurrency(plData.netProfit[period] || 0)}
                </TableCell>
              ))}
              <TableCell sx={sx.amountCell}>{formatCurrency(plData.totalNetProfit)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default Component
