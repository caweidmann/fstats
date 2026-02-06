'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useStorage } from '@/context/Storage'
import { useFileHelper } from '@/hooks'

import { AddFolderButton, FileDropZone, Summary } from './components'
import { ui } from './styled'

const Page = () => {
  const sx = ui()
  const router = useRouter()
  const { isLoading, files } = useStorage()
  const { selectedFiles } = useFileHelper()

  if (isLoading) {
    return <PageWrapper>Loading...</PageWrapper>
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
          <FileDropZone />
        </Grid>

        <Grid size={12}>
          <AddFolderButton />
        </Grid>

        <Grid size={12}>
          <Summary />
        </Grid>

        {files.length ? (
          <Grid size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onMouseEnter={() => router.prefetch(ROUTES.STATS)}
                onClick={() => router.push(ROUTES.STATS)}
                sx={sx.ctaButton}
                disabled={!selectedFiles.length}
                loading={selectedFiles.some((file) => file.status === 'parsing')}
              >
                Continue with {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}
              </Button>
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </PageWrapper>
  )
}

export default Page
