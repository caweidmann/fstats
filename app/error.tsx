'use client'

import { Grid, Typography } from '@mui/material'

import { PageWrapper } from '@/components'

const Page = () => {
  return (
    <PageWrapper>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography color="primary" variant="body2" sx={{ fontWeight: 'bold', fontSize: 40 }}>
            :(
          </Typography>
          <Typography color="primary" variant="body2" sx={{ fontWeight: 'bold', fontSize: 20 }}>
            An unknown error has occurred.
          </Typography>
          <Typography color="secondary" variant="body2" sx={{ mb: 4 }}>
            If the problem persists, please contact support.
          </Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
