'use client'

import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { PageWrapper } from '@/components'
import { usePersist } from '@/components/PersistProvider'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { persistEnabled, setPersistEnabled, isInitialized } = usePersist()

  const handlePersistToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    await setPersistEnabled(newValue)
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControlLabel
            disabled={!isInitialized}
            control={<Switch checked={persistEnabled} onChange={handlePersistToggle} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 0 }}>
                  Persist data
                </Typography>
                <Typography variant="caption" color={persistEnabled ? 'warning' : 'text.secondary'}>
                  {persistEnabled
                    ? 'Files will be kept in your browser storage across sessions until manually deleted'
                    : 'Files will be automatically cleared when you refresh or close the tab'}
                </Typography>
              </Box>
            }
          />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
