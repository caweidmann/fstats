import { Grid } from '@mui/material'

import { PageWrapper } from '@/components'

import { DeviceSettings, StorageSettings } from './components'

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
      </Grid>
    </PageWrapper>
  )
}

export default Page
