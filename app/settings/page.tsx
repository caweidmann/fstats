'use client'

import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ChangeEvent } from 'react'

import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { persistData, set } = useUserPreferences()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    set('persistData', event.target.checked)
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControlLabel
            control={<Switch checked={persistData} onChange={onChange} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 0 }}>
                  Persist data
                </Typography>
                <Typography variant="caption" color={persistData ? 'warning' : 'text.secondary'}>
                  {persistData
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
