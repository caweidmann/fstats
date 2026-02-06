'use client'

import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

import { MISC, ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { CARD_ITEMS, STEPS } from './actions'
import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const router = useRouter()

  return (
    <PageWrapper>
      <Box sx={sx.hero}>
        <img
          src={isDarkMode ? '/img/logo-dark.svg' : '/img/logo.svg'}
          alt="fstats"
          style={{ width: isMobile ? 96 : 128, height: 'auto', marginBottom: 24 }}
        />

        <Typography variant="h1" sx={sx.heroTitle}>
          Analyse bank statements{' '}
          <Box component="span" sx={sx.heroTitleAccent}>
            privately
          </Box>
        </Typography>

        <Typography variant="body1" component="p" sx={sx.heroSubtitle}>
          Add your CSV statements and get instant insights. All processing happens entirely on your device — no uploads,
          no accounts, no tracking.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={sx.ctaButton}
          onMouseEnter={() => router.prefetch(ROUTES.DATA)}
          onClick={() => router.push(ROUTES.DATA)}
        >
          Get started
        </Button>
      </Box>

      <Grid container spacing={isMobile ? 2 : 3} sx={sx.trustSection}>
        {CARD_ITEMS.map(({ Icon, title, description }) => (
          <Grid size={isMobile ? 12 : 4} key={title}>
            <Box sx={sx.trustCard}>
              <Icon sx={sx.trustIcon} />
              <Typography variant="h6" sx={sx.trustTitle}>
                {title}
              </Typography>
              <Typography variant="body2" sx={sx.trustDescription}>
                {description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={sx.section}>
        <Typography variant="h5" sx={sx.sectionTitle}>
          How it works
        </Typography>

        <Grid container spacing={isMobile ? 3 : 4} sx={{ mb: 6 }}>
          {STEPS.map(({ step, title, description }) => (
            <Grid size={isMobile ? 12 : 4} key={step}>
              <Box sx={sx.stepCard}>
                <Box sx={sx.stepBadge}>{step}</Box>
                <Typography variant="h6" sx={sx.stepTitle}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={sx.stepDescription}>
                  {description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="large"
          sx={sx.ctaButton}
          onMouseEnter={() => router.prefetch(ROUTES.DATA)}
          onClick={() => router.push(ROUTES.DATA)}
        >
          Get started now
        </Button>
      </Box>

      <Box sx={sx.banksSection}>
        <Typography variant="h6" sx={sx.sectionTitle}>
          Supported banks
        </Typography>
        <Box sx={sx.bankGrid}>
          {MISC.SUPPORTED_BANKS.map((bank) => (
            <Chip key={bank} label={bank} sx={sx.bankChip} />
          ))}
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default Page
