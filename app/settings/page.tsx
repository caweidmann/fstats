import { Grid, Typography } from '@mui/material'

import { CONFIG } from '@/common'
import { PageWrapper } from '@/components'
import { isFeatureEnabled } from '@/utils/Features'

import { DeviceSettings, StorageSettings, UserPreferences } from './components'

const Page = () => {
  const isWip = isFeatureEnabled('wip')

  return (
    <PageWrapper>
      <Grid container spacing={4}>
        <Grid size={12}>
          <DeviceSettings />
        </Grid>

        <Grid size={12}>
          <StorageSettings />
        </Grid>

        {isWip ? (
          <Grid size={12}>
            <UserPreferences />
          </Grid>
        ) : null}

        <Grid size={12}>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>App version: v{CONFIG.APP_VERSION}</Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
