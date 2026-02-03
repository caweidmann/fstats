'use client'

import { useState } from 'react'
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ErrorOutlined,
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
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

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

  const { getRootProps, getInputProps, isDragActive, uploadingFiles, rejectedFiles, removeFile, clearRejectedFiles } =
    useFileUpload({
      maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
      accept: { 'text/csv': ['.csv'] },
      multiple: true,
    })

  const allFilesComplete = uploadingFiles.length > 0 && uploadingFiles.every((file) => file.status === 'complete')

  const handleContinue = () => {
    router.push(ROUTES.STATS)
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
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Currently supported banks:
          </Typography>
        </Grid>

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
          <Alert severity="success" icon={<CheckCircleOutlined />}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              🔒 100% Private & Secure
            </Typography>
            <Typography variant="body2" component="div">
              • Your files <strong>never leave your device</strong> - all processing happens in your browser
              <br />
              • No servers, no cloud storage, no remote databases
              <br />
              • Files are stored locally in your browser and automatically deleted when you close or refresh this tab
              <br />• This app works completely offline - you can disconnect from the internet right now
            </Typography>
          </Alert>
        </Grid>

        <Grid size={12}>
          <Box
            {...rootProps}
            onClick={handleDropZoneClick}
            sx={sx.dropZone(isDragActive)}
          >
            <input {...getInputProps()} />
            <CloudUploadOutlined sx={sx.uploadIcon} />
            <Typography variant="h5">
              {uploadMode === 'folder' ? 'Select your folder!' : 'Drop your files here!'}
            </Typography>
            <Typography variant="body2">CSV files only, max 5MB each.</Typography>
          </Box>
        </Grid>

        {rejectedFiles.length > 0 ? (
          <Grid size={12}>
            <Alert severity="warning" onClose={clearRejectedFiles}>
              <Typography variant="body2" fontWeight="bold">
                Some files were rejected:
              </Typography>
              {rejectedFiles.map(({ file, errors }) => (
                <Typography key={file.name} variant="body2">
                  • {file.name}: {errors.map((e) => e.message).join(', ')}
                </Typography>
              ))}
            </Alert>
          </Grid>
        ) : null}

        {uploadingFiles.length > 0 ? (
          <Grid size={12}>
            <Stack spacing={1.5}>
              {uploadingFiles.map((uploadFile) => (
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
                          {uploadFile.status === 'complete' && (
                            <CheckCircleOutlined sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                          {uploadFile.status === 'error' && (
                            <ErrorOutlined sx={{ color: 'error.main', fontSize: 20 }} />
                          )}
                        </Stack>
                      </Stack>
                      <Box sx={sx.progressContainer}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadFile.progress}
                          sx={sx.progressBar(uploadFile.status)}
                        />
                      </Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={sx.statusContainer}>
                        <Typography variant="caption" color="text.secondary">
                          {uploadFile.status === 'uploading'
                            ? `${Math.round(uploadFile.progress)}%`
                            : uploadFile.status === 'complete'
                              ? 'Complete'
                              : 'Failed'}
                        </Typography>
                      </Stack>
                    </Box>
                    <IconButton size="small" onClick={() => removeFile(uploadFile.id)} sx={sx.deleteButton}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Grid>
        ) : null}

        {allFilesComplete && (
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
