'use client'

import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { PageWrapper, useSettings } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { settings, setSetting } = useSettings()

  const handlePersistToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSetting('persist', event.target.checked)
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControlLabel
            control={<Switch checked={settings.persist} onChange={handlePersistToggle} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 0 }}>
                  Persist data
                </Typography>
                <Typography variant="caption" color={settings.persist ? 'warning' : 'text.secondary'}>
                  {settings.persist
                    ? 'Files will be kept in your browser storage until manually deleted'
                    : 'Files will be automatically cleared when you close the tab or app'}
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
