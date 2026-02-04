'use client'

import { ArrowBack, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { Color } from '@/styles/colors'
import { getAllFiles, getSelectedFiles } from '@/lib/storage'

interface FileData {
  id: string
  name: string
  size: number
  data: Record<string, unknown>[]
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]
const MAX_VISIBLE_COLUMNS = 10

interface FileTableProps {
  fileData: FileData
}

const FileTable = ({ fileData }: FileTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [columnPage, setColumnPage] = useState(0)

  const columns = useMemo(() => (fileData.data.length > 0 ? Object.keys(fileData.data[0]) : []), [fileData.data])

  const totalColumnPages = Math.ceil(columns.length / MAX_VISIBLE_COLUMNS)
  const visibleColumns = useMemo(() => {
    const start = columnPage * MAX_VISIBLE_COLUMNS
    return columns.slice(start, start + MAX_VISIBLE_COLUMNS)
  }, [columns, columnPage])

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage
    return fileData.data.slice(start, start + rowsPerPage)
  }, [fileData.data, page, rowsPerPage])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handlePrevColumns = () => {
    setColumnPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextColumns = () => {
    setColumnPage((prev) => Math.min(totalColumnPages - 1, prev + 1))
  }

  return (
    <Card>
      <CardHeader title={fileData.name} subheader={`${fileData.data.length} rows, ${columns.length} columns`} />
      <CardContent>
        {columns.length > MAX_VISIBLE_COLUMNS && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <IconButton onClick={handlePrevColumns} disabled={columnPage === 0} size="small">
              <KeyboardArrowLeft />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Columns {columnPage * MAX_VISIBLE_COLUMNS + 1}-
              {Math.min((columnPage + 1) * MAX_VISIBLE_COLUMNS, columns.length)} of {columns.length}
            </Typography>
            <IconButton onClick={handleNextColumns} disabled={columnPage >= totalColumnPages - 1} size="small">
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        )}
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'background.paper',
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={column}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, rowIndex) => {
                const rowKey = `row-${page}-${rowIndex}`
                return (
                  <TableRow key={rowKey} hover>
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={row[column] != null ? String(row[column]) : undefined}
                      >
                        {row[column] != null ? String(row[column]) : '—'}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={fileData.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  )
}

const StatsPage = () => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const [filesData, setFilesData] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const [allFiles, selectedFileIds] = await Promise.all([getAllFiles(), getSelectedFiles()])

        if (allFiles.length === 0) {
          setLoading(false)
          return
        }

        const selectedSet = selectedFileIds ? new Set(selectedFileIds) : null
        const filteredFiles = selectedSet ? allFiles.filter((f) => selectedSet.has(f.id)) : allFiles

        const allFilesData: FileData[] = filteredFiles.map((fileData) => ({
          id: fileData.id,
          name: fileData.name,
          size: fileData.size,
          data: fileData.data as Record<string, unknown>[],
        }))

        setFilesData(allFilesData)
      } catch (error) {
        console.error('Failed to load files from IndexedDB:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  if (loading) {
    return (
      <PageWrapper>
        <Typography>Loading...</Typography>
      </PageWrapper>
    )
  }

  if (filesData.length === 0) {
    return (
      <PageWrapper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: isMobile ? 2 : 6,
          }}
        >
          <img
            src={isDarkMode ? '/img/logo-dark.svg' : '/img/logo.svg'}
            alt="fstats"
            style={{ width: isMobile ? 96 : 128, height: 'auto', marginBottom: 24 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
            No data to{' '}
            <Box component="span" sx={{ color: isDarkMode ? Color.cyan : Color.cyanDark }}>
              analyse
            </Box>
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ color: 'text.secondary', maxWidth: 440, fontSize: isMobile ? 15 : 17, lineHeight: 1.7, mb: 4 }}
          >
            Upload files and then come back to view your stats.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ minWidth: 200, py: 1.5, px: 5, fontSize: 17, fontWeight: 600, borderRadius: 100 }}
            onMouseEnter={() => router.prefetch(ROUTES.DATA)}
            onClick={() => router.push(ROUTES.DATA)}
          >
            Upload files
          </Button>
        </Box>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">CSV Statistics</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onMouseEnter={() => router.prefetch(ROUTES.DATA)}
            onClick={() => router.push(ROUTES.DATA)}
          >
            Back
          </Button>
        </Box>

        {filesData.map((fileData) => (
          <FileTable key={fileData.id} fileData={fileData} />
        ))}
      </Stack>
    </PageWrapper>
  )
}

export default StatsPage
