'use client'

import { Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const { t } = useTranslation()
  const sx = ui(theme, isMobile, isDarkMode)

  return (
    <PageWrapper>
      <Grid container spacing={0}>
        <Grid size={12}>
          <Typography variant="body2">hi</Typography>
        </Grid>

        <Grid size={12} sx={{ mt: isMobile ? 8 : 10 }}>
          <Typography variant="h6" sx={sx.sectionTitle}>
            {t('DATA_DISPLAY.FEATURED_PROJECTS')}
          </Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
