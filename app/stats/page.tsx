'use client'

import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useFileHelper, useIsDarkMode, useIsMobile } from '@/hooks'
import { Color } from '@/styles/colors'

const StatsPage = () => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const { selectedFiles } = useFileHelper()

  if (!selectedFiles.length) {
    return (
      <PageWrapper>
        <Grid size={12} sx={{ pt: isMobile ? 2 : 6, textAlign: 'center' }}>
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
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, mb: 4 }}
          >
            Upload a CSV file and then come back to view your stats.
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
        </Grid>
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

        {selectedFiles.map((file) => (
          <Card key={file.id}>
            <CardHeader title={file.file.name} subheader={`${file.parsedContentRows?.length} rows, ${3} columns`} />
            <CardContent>hi</CardContent>
          </Card>
        ))}
      </Stack>
    </PageWrapper>
  )
}

export default StatsPage
