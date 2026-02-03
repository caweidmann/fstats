'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Stack,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { PageWrapper } from '@/components'

interface FileMetadata {
  id: string
  name: string
  size: number
}

interface FileData {
  metadata: FileMetadata
  data: Record<string, unknown>[]
}

const StatsPage = () => {
  const router = useRouter()
  const [filesData, setFilesData] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Retrieve file metadata from session storage
      const uploadedFiles = JSON.parse(sessionStorage.getItem('uploaded_files') || '[]') as FileMetadata[]

      if (uploadedFiles.length === 0) {
        setLoading(false)
        return
      }

      // Retrieve data for each file
      const allFilesData: FileData[] = uploadedFiles
        .map((metadata) => {
          const dataStr = sessionStorage.getItem(`file_${metadata.id}`)
          if (!dataStr) return null

          try {
            const data = JSON.parse(dataStr) as Record<string, unknown>[]
            return { metadata, data }
          } catch (error) {
            console.error(`Failed to parse data for file ${metadata.name}:`, error)
            return null
          }
        })
        .filter((item): item is FileData => item !== null)

      setFilesData(allFilesData)
    } catch (error) {
      console.error('Failed to load files from session storage:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBack = () => {
    router.push('/')
  }

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
        <Stack spacing={2}>
          <Alert severity="info">No files found. Please upload CSV files first.</Alert>
          <Button variant="contained" startIcon={<ArrowBack />} onClick={handleBack}>
            Back to Upload
          </Button>
        </Stack>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">CSV Statistics</Typography>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
            Back
          </Button>
        </Box>

        {filesData.map((fileData) => {
          const columns = fileData.data.length > 0 ? Object.keys(fileData.data[0]) : []

          return (
            <Card key={fileData.metadata.id}>
              <CardHeader
                title={fileData.metadata.name}
                subheader={`${fileData.data.length} rows, ${columns.length} columns`}
              />
              <CardContent>
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column} sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fileData.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} hover>
                          {columns.map((column) => (
                            <TableCell key={column}>
                              {row[column] !== null && row[column] !== undefined
                                ? String(row[column])
                                : '—'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </PageWrapper>
  )
}

export default StatsPage
