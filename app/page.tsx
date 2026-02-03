'use client'

import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ErrorOutlined,
  ExpandLess,
  ExpandMore,
  FolderOpenOutlined,
  InsertDriveFileOutlined,
  UploadFileOutlined,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { MISC, ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { formatFileSize, useFileUpload, useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const router = useRouter()
  const [uploadMode, setUploadMode] = useState<'file' | 'folder'>('file')
  const [persistData, setPersistData] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('persist-data') === 'true'
    }
    return false
  })
  const [expandedSections, setExpandedSections] = useState({
    uploading: true,
    complete: false,
    error: true,
  })

  const handlePersistToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setPersistData(newValue)
    localStorage.setItem('persist-data', String(newValue))
  }

  const { getRootProps, getInputProps, isDragActive, uploadingFiles, removeFile } = useFileUpload({
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    accept: { 'text/csv': ['.csv'] },
    multiple: true,
  })

  const canContinue = uploadingFiles.length > 0 && uploadingFiles.every((file) => file.status !== 'uploading')

  const handleContinue = () => {
    router.push(ROUTES.STATS)
  }

  // Group files by status
  const filesByStatus = {
    uploading: uploadingFiles.filter((f) => f.status === 'uploading'),
    complete: uploadingFiles.filter((f) => f.status === 'complete'),
    error: uploadingFiles.filter((f) => f.status === 'error'),
  }

  // Calculate overall progress
  const totalFiles = uploadingFiles.length
  const completedFiles = filesByStatus.complete.length
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0

  const toggleSection = (section: 'uploading' | 'complete' | 'error') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const openFolderPicker = async () => {
    try {
      // Check if the File System Access API is supported
      if (!('showDirectoryPicker' in window)) {
        alert('Folder selection is not supported in your browser. Please use a modern browser like Chrome or Edge.')
        return
      }

      // @ts-expect-error - showDirectoryPicker is not yet in TypeScript types
      const directoryHandle = await window.showDirectoryPicker()

      const csvFiles: File[] = []

      // Recursively get all CSV files from the directory
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

      // Collect all CSV files
      const files = await getFilesRecursively(directoryHandle)
      csvFiles.push(...files)

      if (csvFiles.length === 0) {
        alert('No CSV files found in the selected folder.')
        return
      }

      // Manually trigger the onDrop logic by simulating a drop
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      if (input) {
        // Create a FileList-like object
        const dataTransfer = new DataTransfer()
        csvFiles.forEach((file) => dataTransfer.items.add(file))
        input.files = dataTransfer.files

        // Trigger change event
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

  const rootProps = getRootProps()

  const handleDropZoneClick = async (e: React.MouseEvent<HTMLElement>) => {
    if (uploadMode === 'folder') {
      e.preventDefault()
      e.stopPropagation()
      await openFolderPicker()
    } else {
      // In file mode, call the original dropzone click handler
      if (rootProps.onClick) {
        rootProps.onClick(e)
      }
    }
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h4" gutterBottom>
            Private Bank Statement Analyzer
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Process your financial CSVs safely - all data stays on your device, nothing is uploaded to any server.
          </Typography>
        </Grid>

        <Grid size={12}>
          <Alert severity="info">
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              🔒 100% Private & Secure
            </Typography>
            <Typography variant="body2" component="div">
              {MISC.CENTER_DOT_XL} Your files <strong>never leave your device</strong> - all processing happens in your
              browser
              <br />
              {MISC.CENTER_DOT_XL} No servers, no cloud storage, no remote databases
              <br />
              {MISC.CENTER_DOT_XL} This app works completely offline - you can disconnect from the internet right now
            </Typography>

            <Box>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Currently supported banks:
              </Typography>

              <Grid container spacing={2}>
                <Grid size={3}>
                  <Card>FNB</Card>
                </Grid>
                <Grid size={3}>
                  <Card>Capitec</Card>
                </Grid>
                <Grid size={3}>
                  <Card>Comdirect</Card>
                </Grid>
                <Grid size={3}>
                  <Card>ING</Card>
                </Grid>
              </Grid>
            </Box>
          </Alert>
        </Grid>

        <Grid size={12}>
          <Typography variant="body2">Select how you want to process your CSVs.</Typography>

          <ButtonGroup disableElevation variant="outlined">
            <Button
              variant={uploadMode === 'file' ? 'contained' : 'outlined'}
              startIcon={<UploadFileOutlined />}
              sx={sx.button}
              onClick={() => setUploadMode('file')}
            >
              File upload
            </Button>
            <Button
              variant={uploadMode === 'folder' ? 'contained' : 'outlined'}
              startIcon={<FolderOpenOutlined />}
              sx={sx.button}
              onClick={() => setUploadMode('folder')}
            >
              Select local folder
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid size={12}>
          <FormControlLabel
            control={<Switch checked={persistData} onChange={handlePersistToggle} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 0 }}>
                  Persist data
                </Typography>
                <Typography variant="caption" color={persistData ? 'warning' : 'text.secondary'}>
                  {persistData
                    ? 'Files will be kept in your browser storage across sessions until manually deleted'
                    : 'Files will be automatically cleared when you refresh or close the tab'}
                </Typography>
              </Box>
            }
          />
        </Grid>

        <Grid size={12}>
          <Box {...rootProps} onClick={handleDropZoneClick} sx={sx.dropZone(isDragActive)}>
            <input {...getInputProps()} />
            <CloudUploadOutlined sx={sx.uploadIcon} />
            <Typography variant="h5">
              {uploadMode === 'folder' ? 'Select your folder!' : 'Drop your files here!'}
            </Typography>
            <Typography variant="body2">CSV files only, max 5MB each.</Typography>
          </Box>
        </Grid>

        {uploadingFiles.length > 0 ? (
          <Grid size={12}>
            <Stack spacing={2}>
              {/* Summary Header */}
              <Box sx={sx.summaryCard}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {totalFiles} {totalFiles === 1 ? 'file' : 'files'} total
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {filesByStatus.complete.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 18 }} />
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            {filesByStatus.complete.length} complete
                          </Typography>
                        </Stack>
                      )}
                      {filesByStatus.uploading.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: 'primary.main',
                              borderTopColor: 'transparent',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                              },
                            }}
                          />
                          <Typography variant="body2" color="primary.main" fontWeight="medium">
                            {filesByStatus.uploading.length} uploading
                          </Typography>
                        </Stack>
                      )}
                      {filesByStatus.error.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <ErrorOutlined sx={{ color: 'error.main', fontSize: 18 }} />
                          <Typography variant="body2" color="error.main" fontWeight="medium">
                            {filesByStatus.error.length} failed
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Overall Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        {Math.round(overallProgress)}%
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={overallProgress} sx={sx.overallProgress} />
                  </Box>
                </Stack>
              </Box>

              {/* Uploading Section */}
              {filesByStatus.uploading.length > 0 && (
                <Box>
                  <Button
                    fullWidth
                    onClick={() => toggleSection('uploading')}
                    sx={sx.sectionHeader}
                    endIcon={expandedSections.uploading ? <ExpandLess /> : <ExpandMore />}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Uploading
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({filesByStatus.uploading.length})
                      </Typography>
                    </Stack>
                  </Button>
                  <Collapse in={expandedSections.uploading}>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {filesByStatus.uploading.map((uploadFile) => (
                        <Box key={uploadFile.id} sx={sx.fileCard(uploadFile.status)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <InsertDriveFileOutlined sx={sx.fileIcon} />
                            <Box sx={sx.fileContentBox}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontWeight="medium" sx={sx.fileName}>
                                  {uploadFile.file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(uploadFile.file.size)}
                                </Typography>
                              </Stack>
                              <Box sx={sx.progressContainer}>
                                <LinearProgress
                                  variant="determinate"
                                  value={uploadFile.progress}
                                  sx={sx.progressBar(uploadFile.status)}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(uploadFile.progress)}%
                              </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => removeFile(uploadFile.id)} sx={sx.deleteButton}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>
              )}

              {/* Complete Section */}
              {filesByStatus.complete.length > 0 && (
                <Box>
                  <Button
                    fullWidth
                    onClick={() => toggleSection('complete')}
                    sx={sx.sectionHeader}
                    endIcon={expandedSections.complete ? <ExpandLess /> : <ExpandMore />}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Complete
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({filesByStatus.complete.length})
                      </Typography>
                    </Stack>
                  </Button>
                  <Collapse in={expandedSections.complete}>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {filesByStatus.complete.map((uploadFile) => (
                        <Box key={uploadFile.id} sx={sx.fileCard(uploadFile.status)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <InsertDriveFileOutlined sx={sx.fileIcon} />
                            <Box sx={sx.fileContentBox}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontWeight="medium" sx={sx.fileName}>
                                  {uploadFile.file.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(uploadFile.file.size)}
                                  </Typography>
                                  <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 20 }} />
                                </Stack>
                              </Stack>
                            </Box>
                            <IconButton size="small" onClick={() => removeFile(uploadFile.id)} sx={sx.deleteButton}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>
              )}

              {/* Error Section */}
              {filesByStatus.error.length > 0 && (
                <Box>
                  <Button
                    fullWidth
                    onClick={() => toggleSection('error')}
                    sx={sx.sectionHeader}
                    endIcon={expandedSections.error ? <ExpandLess /> : <ExpandMore />}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Failed
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({filesByStatus.error.length})
                      </Typography>
                    </Stack>
                  </Button>
                  <Collapse in={expandedSections.error}>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {filesByStatus.error.map((uploadFile) => (
                        <Box key={uploadFile.id} sx={sx.fileCard(uploadFile.status)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <InsertDriveFileOutlined sx={sx.fileIcon} />
                            <Box sx={sx.fileContentBox}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography fontWeight="medium" sx={sx.fileName}>
                                  {uploadFile.file.name}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(uploadFile.file.size)}
                                  </Typography>
                                  <ErrorOutlined sx={{ color: 'error.main', fontSize: 20 }} />
                                </Stack>
                              </Stack>
                              <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
                                {uploadFile.error || 'Failed'}
                              </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => removeFile(uploadFile.id)} sx={sx.deleteButton}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>
              )}
            </Stack>
          </Grid>
        ) : null}

        {canContinue && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" size="large" onClick={handleContinue} sx={{ minWidth: 200, py: 1.5 }}>
                Continue
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </PageWrapper>
  )
}

export default Page
