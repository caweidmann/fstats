import { Grid, Typography } from '@mui/material'

import { CONFIG } from '@/common'
import { PageWrapper } from '@/components'

import { DeviceSettings, StorageSettings, UserPreferences } from './components'

const Page = () => {
  return (
    <PageWrapper>
      <Grid container spacing={4}>
        <Grid size={12}>
          <DeviceSettings />
        </Grid>

        <Grid size={12}>
          <StorageSettings />
        </Grid>

        <Grid size={12}>
          <UserPreferences />
        </Grid>

        <Grid size={12}>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>Version: v{CONFIG.APP_VERSION}</Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
