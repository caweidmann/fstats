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

import { ui } from './styled'

type TransactionRow = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  status: 'verified' | 'needs-review' | 'categorized'
  taxDeductible: boolean
}

// Dummy data matching German freelancer tax categories
const DUMMY_TRANSACTIONS: TransactionRow[] = [
  {
    id: '1',
    date: '30/10/2025',
    description: 'Adobe Creative Cloud Subscription',
    amount: -59.99,
    category: 'Other Operating Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '2',
    date: '28/10/2025',
    description: 'Client Payment - Website Design',
    amount: 2500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '3',
    date: '25/10/2025',
    description: 'Office Rent - October',
    amount: -850.0,
    category: 'Office & Rent',
    status: 'needs-review',
    taxDeductible: true,
  },
  {
    id: '4',
    date: '22/10/2025',
    description: 'AWS Cloud Services',
    amount: -145.32,
    category: 'Software & Subscriptions',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '5',
    date: '20/10/2025',
    description: 'Office Supplies - Staples',
    amount: -87.45,
    category: 'Office Supplies',
    status: 'categorized',
    taxDeductible: true,
  },
  {
    id: '6',
    date: '18/10/2025',
    description: 'Client Payment - Logo Design',
    amount: 1200.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
  {
    id: '7',
    date: '15/10/2025',
    description: 'Telekom Internet - Monthly',
    amount: -49.99,
    category: 'Utilities & Internet',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '8',
    date: '12/10/2025',
    description: 'Freelancer Marketplace Fee',
    amount: -125.0,
    category: 'Professional Fees',
    status: 'needs-review',
    taxDeductible: true,
  },
  {
    id: '9',
    date: '10/10/2025',
    description: 'Business Travel - Train Ticket',
    amount: -89.0,
    category: 'Travel Expenses',
    status: 'verified',
    taxDeductible: true,
  },
  {
    id: '10',
    date: '08/10/2025',
    description: 'Client Payment - Consulting',
    amount: 3500.0,
    category: 'Revenue',
    status: 'verified',
    taxDeductible: false,
  },
]

type TransactionsTableProps = {
  selectedCategory?: string | null
}

const Component = ({ selectedCategory = null }: TransactionsTableProps) => {
  const theme = useTheme()
  const sx = ui(theme)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
    let filtered = DUMMY_TRANSACTIONS

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
  }, [searchQuery, selectedCategory])

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

      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={sx.tableHeader}>Date</TableCell>
              <TableCell sx={sx.tableHeader}>Description</TableCell>
              <TableCell sx={sx.tableHeader}>Category</TableCell>
              <TableCell sx={sx.tableHeader} align="right">
                Amount
              </TableCell>
              <TableCell sx={sx.tableHeader} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover sx={sx.tableRow}>
                  <TableCell sx={sx.compactCell}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 0 }}>
                      {highlightText(row.date, searchQuery)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sx.compactCell}>
                    <Box sx={sx.descriptionCell}>
                      {getStatusIcon(row.status)}
                      <Typography variant="body2" sx={{ ml: 1, fontSize: '0.875rem', mb: 0 }}>
                        {highlightText(row.description, searchQuery)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={sx.compactCell}>
                    <Chip
                      label={highlightText(row.category, searchQuery)}
                      size="small"
                      color={getCategoryColor(row.category)}
                      sx={sx.categoryChip}
                    />
                  </TableCell>
                  <TableCell align="right" sx={sx.compactCell}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 0,
                        color: row.amount >= 0 ? green[600] : 'text.primary',
                        fontWeight: row.amount >= 0 ? 600 : 400,
                        fontSize: '0.875rem',
                      }}
                    >
                      {row.amount >= 0 ? '+' : ''}€{Math.abs(row.amount).toFixed(2)}
                    </Typography>
                    {row.taxDeductible && (
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}
                      >
                        Tax deductible
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={sx.compactCell}>
                    <IconButton size="small" onClick={handleMenuClick}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
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
