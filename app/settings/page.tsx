'use client'

import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const [persistData, setPersistData] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('persist-data') === 'true'
    }
    return false
  })

  const handlePersistToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setPersistData(newValue)
    localStorage.setItem('persist-data', String(newValue))
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControlLabel
            control={<Switch checked={persistData} onChange={handlePersistToggle} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 0 }}>
                  Persist data
                </Typography>
                <Typography variant="caption" color={persistData ? 'warning' : 'text.secondary'}>
                  {persistData
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
