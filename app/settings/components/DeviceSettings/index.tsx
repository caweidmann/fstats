'use client'

import { Box, Card, FormControlLabel, Switch, Typography } from '@mui/material'
import type { ChangeEvent } from 'react'

import { useUserPreferences } from '@/hooks'

const Component = () => {
  const { persistData, set } = useUserPreferences()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    set('persistData', event.target.checked)
  }

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Device settings
      </Typography>

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
    </Card>
  )
}

export default Component
