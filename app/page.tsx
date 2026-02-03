'use client'

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

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>Currently supported banks:</Grid>
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
            <Button variant="contained" startIcon={<UploadFileOutlined />} sx={sx.button}>
              File upload
            </Button>
            <Button startIcon={<FolderOpenOutlined />} sx={sx.button}>
              Select local folder
            </Button>
          </ButtonGroup>
        </Grid>

        <Grid size={12}>
          <Alert severity="info">
            When you upload files, they are kept in session storage. Files never leave your PC. When you close the tab
            or browser, the files are deleted.
          </Alert>
        </Grid>

        <Grid size={12}>
          <Box {...getRootProps()} sx={sx.dropZone(isDragActive)}>
            <input {...getInputProps()} />
            <CloudUploadOutlined sx={sx.uploadIcon} />
            <Typography variant="h5">Drop your files here!</Typography>
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
