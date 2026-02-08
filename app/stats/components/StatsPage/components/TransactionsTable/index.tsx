'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import WarningIcon from '@mui/icons-material/Warning'
import {
  Box,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { blue, green, orange, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { useMemo, useState } from 'react'

import type { ParsedContentRow } from '@/types'
import { useIsMobile } from '@/hooks'

import { DEMO_TRANSACTIONS, type TransactionRow } from '../../demo-data'
import { ui } from './styled'

type TransactionsTableProps = {
  isDemoMode: boolean
  transactions: ParsedContentRow[]
  selectedCategory?: string | null
}

const Component = ({ isDemoMode, transactions, selectedCategory = null }: TransactionsTableProps) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(theme, isMobile)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Convert real transactions to display format
  const realTransactions: TransactionRow[] = transactions.map((t, index) => ({
    id: `${index}`,
    date: t.date,
    description: t.description,
    amount: t.value.toNumber(),
    category: t.value.gt(0) ? 'Revenue' : 'Expense',
    status: 'verified' as const,
    taxDeductible: t.value.lt(0),
  }))

  const displayTransactions = isDemoMode ? DEMO_TRANSACTIONS : realTransactions

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getStatusIcon = (status: TransactionRow['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon sx={{ color: green[500], fontSize: 18 }} />
      case 'needs-review':
        return <WarningIcon sx={{ color: orange[500], fontSize: 18 }} />
      case 'categorized':
        return <LocalOfferIcon sx={{ color: blue[500], fontSize: 18 }} />
    }
  }

  const getCategoryColor = (category: string) => {
    if (category === 'Revenue') return 'success'
    if (category.includes('Travel')) return 'info'
    if (category.includes('Office')) return 'warning'
    return 'default'
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Box key={`${part}-${index}`} component="span" sx={sx.highlight}>
              {part}
            </Box>
          ) : (
            <span key={`${part}-${index}`}>{part}</span>
          ),
        )}
      </>
    )
  }

  const filteredTransactions = useMemo(() => {
    let filtered = displayTransactions

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((row) => row.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (row) =>
          row.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.date.includes(searchQuery),
      )
    }

    return filtered
  }, [searchQuery, selectedCategory, displayTransactions])

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Box sx={sx.searchContainer}>
        <TextField
          fullWidth
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={sx.searchField}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: isMobile ? 'auto' : 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={sx.tableHeader}>Date</TableCell>
              <TableCell sx={sx.tableHeader}>Description</TableCell>
              {!isMobile && <TableCell sx={sx.tableHeader}>Category</TableCell>}
              <TableCell sx={sx.tableHeader} align="right">
                Amount
              </TableCell>
              {!isMobile && (
                <TableCell sx={sx.tableHeader} align="center">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 3 : 5} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover sx={sx.tableRow}>
                  <TableCell sx={sx.compactCell}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', mb: 0, whiteSpace: 'nowrap' }}
                    >
                      {highlightText(row.date, searchQuery)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sx.compactCell}>
                    <Box sx={sx.descriptionCell}>
                      {!isMobile && getStatusIcon(row.status)}
                      <Typography
                        variant="body2"
                        sx={{
                          ml: isMobile ? 0 : 1,
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          mb: 0,
                          maxWidth: isMobile ? 150 : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isMobile ? 'nowrap' : 'normal',
                        }}
                      >
                        {highlightText(row.description, searchQuery)}
                      </Typography>
                    </Box>
                    {isMobile && (
                      <Chip
                        label={row.category}
                        size="small"
                        color={getCategoryColor(row.category)}
                        sx={{ ...sx.categoryChip, mt: 0.5 }}
                      />
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={sx.compactCell}>
                      <Chip
                        label={highlightText(row.category, searchQuery)}
                        size="small"
                        color={getCategoryColor(row.category)}
                        sx={sx.categoryChip}
                      />
                    </TableCell>
                  )}
                  <TableCell align="right" sx={sx.compactCell}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0,
                        color: row.amount >= 0 ? green[600] : 'text.primary',
                        fontWeight: row.amount >= 0 ? 600 : 400,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.amount >= 0 ? '+' : ''}€{Math.abs(row.amount).toFixed(2)}
                    </Typography>
                    {row.taxDeductible && !isMobile && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}
                      >
                        Tax deductible
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell align="center" sx={sx.compactCell}>
                      <IconButton size="small" onClick={handleMenuClick}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Change category</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mark as verified</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: red[600] }}>
          Delete transaction
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default Component
