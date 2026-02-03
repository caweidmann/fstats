'use client'

import { FolderOpenOutlined, UploadFileOutlined } from '@mui/icons-material'
import { Alert, Box, Button, ButtonGroup, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const { t } = useTranslation()
  const sx = ui(theme, isMobile, isDarkMode)

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="body2">Select how you want to process your CSVs.</Typography>

          <ButtonGroup disableElevation variant="outlined">
            <Button variant="contained" startIcon={<UploadFileOutlined />} sx={{ borderRadius: 1.5 }}>
              File upload
            </Button>
            <Button startIcon={<FolderOpenOutlined />} sx={{ borderRadius: 1.5 }}>
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
          <Box sx={sx.dropZone}>
            <Typography variant="h5">Drop your CSVs here!</Typography>
            <Typography variant="body2">Up to 20 CSVs, max 5MB each.</Typography>
          </Box>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
