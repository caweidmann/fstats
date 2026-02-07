import { Card, Typography } from '@mui/material'

import { LanguageSwitcher } from '@/components'

const Component = () => {
  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Preferences
      </Typography>

      <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
        Language
      </Typography>
      <LanguageSwitcher showLabel />
    </Card>
  )
}

export default Component
