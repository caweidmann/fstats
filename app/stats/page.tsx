'use client'

import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import type { FileData } from '@/types'
import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useStorage } from '@/context/Storage'
import { useIsDarkMode, useIsMobile, useSettings } from '@/hooks'
import { Color } from '@/styles/colors'

type FileTableProps = {
  file: FileData
}

const FileTable = ({ file }: FileTableProps) => {
  return (
    <Card>
      <CardHeader title={file.file.name} subheader={`${0} rows, ${0} columns`} />
      <CardContent>hi</CardContent>
    </Card>
  )
}

const StatsPage = () => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const { selectedFileIds } = useSettings()
  const { files } = useStorage()

  if (!selectedFileIds.length) {
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

        {files.map((file) => (
          <FileTable key={file.id} file={file} />
        ))}
      </Stack>
    </PageWrapper>
  )
}

export default StatsPage
