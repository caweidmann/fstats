'use client'

import BarChartIcon from '@mui/icons-material/BarChart'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import LockIcon from '@mui/icons-material/Lock'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import TableViewIcon from '@mui/icons-material/TableView'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { ui } from './styled'

const TRUST_ITEMS = [
  {
    Icon: LockIcon,
    title: '100% on-device',
    description: 'All parsing and storage happens in your browser. Your data never touches a server.',
  },
  {
    Icon: CloudOffIcon,
    title: 'Works offline',
    description: 'Once loaded, the app works with no internet connection at all.',
  },
  {
    Icon: PersonOffIcon,
    title: 'No account needed',
    description: 'No sign-up, no login, no cloud sync. Everything stays local.',
  },
]

const STEPS = [
  {
    number: 1,
    Icon: UploadFileIcon,
    title: 'Drop your CSVs',
    description: 'Drag & drop or browse for your bank statement files.',
  },
  {
    number: 2,
    Icon: BarChartIcon,
    title: 'Parsed instantly',
    description: 'Files are parsed in a background worker — fast and non-blocking.',
  },
  {
    number: 3,
    Icon: TableViewIcon,
    title: 'View your stats',
    description: 'Browse paginated tables of your transaction data.',
  },
]

const BANKS = ['FNB', 'Capitec', 'Comdirect', 'ING']

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
          Analyse bank statements <Box component="span" sx={sx.heroTitleAccent}>privately</Box>
        </Typography>

        <Typography variant="body1" component="p" sx={sx.heroSubtitle}>
          Drop your CSV files and get instant insights. All processing happens entirely on your device — no uploads,
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
        {TRUST_ITEMS.map(({ Icon, title, description }) => (
          <Grid size={isMobile ? 12 : 4} key={title}>
            <Box sx={sx.trustCard}>
              <Icon sx={sx.trustIcon} />
              <Typography variant="h6" sx={sx.trustTitle}>{title}</Typography>
              <Typography variant="body2" sx={sx.trustDescription}>{description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={sx.section}>
        <Typography variant="h5" sx={sx.sectionTitle}>How it works</Typography>
        <Grid container spacing={isMobile ? 3 : 4}>
          {STEPS.map(({ number, Icon, title, description }) => (
            <Grid size={isMobile ? 12 : 4} key={number}>
              <Box sx={sx.stepCard}>
                <Box sx={sx.stepBadge}>{number}</Box>
                <Icon sx={sx.stepIcon} />
                <Typography variant="h6" sx={sx.stepTitle}>{title}</Typography>
                <Typography variant="body2" sx={sx.stepDescription}>{description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={sx.banksSection}>
        <Typography variant="h6" sx={sx.sectionTitle}>Supported banks</Typography>
        <Box sx={sx.bankGrid}>
          {BANKS.map((bank) => (
            <Chip key={bank} label={bank} sx={sx.bankChip} />
          ))}
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default Page
