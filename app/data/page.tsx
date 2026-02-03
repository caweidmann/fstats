'use client'

import { AddOutlined, CloudUploadOutlined, DeleteOutlined, ErrorOutlined, FolderOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { MISC, ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { formatFileSize, useFileUpload, useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const formatDate = (date: Date | number) => {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const router = useRouter()
  const [selectedFiles, setSelectedFiles] = useState<Set<string> | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const { getRootProps, getInputProps, isDragActive, uploadingFiles, removeFile } = useFileUpload({
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    accept: { 'text/csv': ['.csv'] },
    multiple: true,
  })

  const completedFiles = uploadingFiles.filter((f) => f.status === 'complete')
  const uploadingInProgress = uploadingFiles.filter((f) => f.status === 'uploading')
  const errorFiles = uploadingFiles.filter((f) => f.status === 'error')

  const effectiveSelectedFiles =
    selectedFiles === null
      ? new Set(completedFiles.map((f) => f.id))
      : new Set(Array.from(selectedFiles).filter((id) => completedFiles.some((f) => f.id === id)))

  const canContinue = effectiveSelectedFiles.size > 0 && uploadingInProgress.length === 0

  const handleContinue = () => {
    router.push(ROUTES.STATS)
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      if (prev === null) {
        const allExceptClicked = new Set(completedFiles.map((f) => f.id))
        allExceptClicked.delete(fileId)
        return allExceptClicked
      }

      const next = new Set(prev)
      if (next.has(fileId)) {
        next.delete(fileId)
      } else {
        next.add(fileId)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (effectiveSelectedFiles.size === completedFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(null)
    }
  }

  const openFolderPicker = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        alert('Folder selection is not supported in your browser. Please use a modern browser like Chrome or Edge.')
        return
      }

      // @ts-expect-error showDirectoryPicker not in TS types
      const directoryHandle = await window.showDirectoryPicker()

      const csvFiles: File[] = []

      const getFilesRecursively = async (dirHandle: any): Promise<File[]> => {
        const files: File[] = []
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.csv')) {
            const file = await entry.getFile()
            files.push(file)
          } else if (entry.kind === 'directory') {
            const subFiles = await getFilesRecursively(entry)
            files.push(...subFiles)
          }
        }
        return files
      }

      const files = await getFilesRecursively(directoryHandle)
      csvFiles.push(...files)

      if (csvFiles.length === 0) {
        alert('No CSV files found in the selected folder.')
        return
      }

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      if (input) {
        const dataTransfer = new DataTransfer()
        csvFiles.forEach((file) => dataTransfer.items.add(file))
        input.files = dataTransfer.files
        const event = new Event('change', { bubbles: true })
        input.dispatchEvent(event)
      }
    } catch (error) {
      const err = error as Error
      if (err.name !== 'AbortError') {
        console.error('Error selecting folder:', error)
        alert('Failed to access the folder. Please try again.')
      }
    }
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Drop files below or add an entire folder.
          </Typography>
        </Grid>

        <Grid size={12}>
          <Box {...getRootProps()} sx={sx.dropZone(isDragActive)}>
            <input {...getInputProps()} />
            <CloudUploadOutlined sx={sx.uploadIcon} />
            <Typography variant="h5">Drop your files here</Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select files
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              CSV files only, max 5MB each
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            endIcon={<FolderOutlined />}
            onClick={openFolderPicker}
            sx={sx.addFolderButton}
          >
            Add folder
          </Button>
        </Grid>

        {uploadingFiles.length > 0 && (
          <Grid size={12}>
            <Box
              sx={{
                ...sx.summaryCard,
                cursor: uploadingInProgress.length === 0 ? 'pointer' : 'default',
              }}
              onClick={() => uploadingInProgress.length === 0 && setShowDetails(!showDetails)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6" fontWeight="medium">
                    {uploadingFiles.length} {uploadingFiles.length === 1 ? 'file' : 'files'}
                  </Typography>
                  {uploadingInProgress.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {effectiveSelectedFiles.size} selected
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  {errorFiles.length > 0 && (
                    <Chip
                      icon={<ErrorOutlined sx={{ fontSize: 16 }} />}
                      label={`${errorFiles.length} failed`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                  {uploadingInProgress.length > 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((completedFiles.length / uploadingFiles.length) * 100)}%
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>

              {uploadingInProgress.length > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={(completedFiles.length / uploadingFiles.length) * 100}
                  sx={{ mt: 1.5, height: 4, borderRadius: 2 }}
                />
              )}
            </Box>

            {showDetails && (
              <Box sx={{ mt: 2 }}>
                <Stack spacing={1.5}>
                  {completedFiles.length > 0 && (
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSelectAll()
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        {effectiveSelectedFiles.size === completedFiles.length ? 'Deselect all' : 'Select all'}
                      </Button>
                    </Stack>
                  )}

                  {[...completedFiles, ...errorFiles].length > 0 && (
                    <Stack spacing={0.5}>
                      {[...completedFiles, ...errorFiles].map((uploadFile) => {
                        const isSelected = effectiveSelectedFiles.has(uploadFile.id)
                        const isError = uploadFile.status === 'error'

                        return (
                          <Box
                            key={uploadFile.id}
                            sx={{
                              py: 0.5,
                              opacity: isError ? 0.7 : 1,
                              cursor: isError ? 'default' : 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              !isError && toggleFileSelection(uploadFile.id)
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {!isError ? (
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => toggleFileSelection(uploadFile.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  size="small"
                                  sx={{ p: 0.5 }}
                                />
                              ) : (
                                <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
                                  <ErrorOutlined sx={{ color: 'error.main', fontSize: 18 }} />
                                </Box>
                              )}
                              <Box sx={sx.fileContentBox}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="body2" fontWeight="medium" sx={sx.fileName}>
                                    {uploadFile.file.name}
                                  </Typography>
                                  {isError && (
                                    <Chip
                                      label="Failed"
                                      size="small"
                                      color="error"
                                      variant="outlined"
                                      sx={{ height: 18, fontSize: '0.7rem' }}
                                    />
                                  )}
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(uploadFile.file.size)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(uploadFile.file.lastModified)}
                                  </Typography>
                                  {isError && uploadFile.error && (
                                    <Tooltip title={uploadFile.error}>
                                      <Typography
                                        variant="caption"
                                        color="error.main"
                                        sx={{ cursor: 'help', textDecoration: 'underline dotted' }}
                                      >
                                        View error
                                      </Typography>
                                    </Tooltip>
                                  )}
                                </Stack>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFile(uploadFile.id)
                                }}
                                sx={sx.deleteButton}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                        )
                      })}
                    </Stack>
                  )}
                </Stack>
              </Box>
            )}
          </Grid>
        )}

        {canContinue && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" size="large" onClick={handleContinue} sx={{ minWidth: 200, py: 1.5 }}>
                Continue with {effectiveSelectedFiles.size} {effectiveSelectedFiles.size === 1 ? 'file' : 'files'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  )
}

export default Page
