import { Box, Card, Typography } from '@mui/material'

import { DateFormatSwitcher, LanguageSwitcher, ThemeSwitcher } from '@/components'
import { isFeatureEnabled } from '@/utils/Features'

const Component = () => {
  const isWip = isFeatureEnabled('wip')

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Preferences
      </Typography>

      <Box>
        <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
          Theme
        </Typography>
        <ThemeSwitcher showLabel />
      </Box>

      {isWip ? (
        <Box sx={{ mt: 3 }}>
          <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
            Language
          </Typography>
          <LanguageSwitcher showLabel />
        </Box>
      ) : null}

      {/* <Box sx={{ mt: 3 }}>
        <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
          Currency
        </Typography>
        <LanguageSwitcher showLabel />
      </Box> */}

      <Box sx={{ mt: 3 }}>
        <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
          Date Format
        </Typography>
        <DateFormatSwitcher showLabel />
      </Box>
    </Card>
  )
}

export default Component
