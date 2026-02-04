'use client'

import { Alert, Box, Button, Card, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

import { MISC, ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const router = useRouter()

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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onMouseEnter={() => router.prefetch(ROUTES.DATA)}
              onClick={() => router.push(ROUTES.DATA)}
              sx={{ minWidth: 200, py: 1.5 }}
            >
              Get started
            </Button>
          </Box>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
