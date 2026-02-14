'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { Color } from '@/styles/colors'

const Component = () => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()

  return (
    <PageWrapper>
      <Grid size={12} sx={{ pt: isMobile ? 2 : 6, textAlign: 'center' }}>
        <img
          src={isDarkMode ? '/img/logo-dark.svg' : '/img/logo.svg'}
          alt="fstats"
          style={{ width: isMobile ? 96 : 128, height: 'auto', marginBottom: 24 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
          No data to{' '}
          <Box component="span" sx={{ color: isDarkMode ? Color.cyan : Color.cyanDark }}>
            analyse
          </Box>
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, mb: 4 }}
        >
          Upload a CSV file and then come back to view your stats.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{ minWidth: 200, py: 1.5, px: 5, fontSize: 17, fontWeight: 600, borderRadius: 100 }}
            onMouseEnter={() => router.prefetch(ROUTES.DATA)}
            onClick={() => router.push(ROUTES.DATA)}
          >
            Upload files
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              minWidth: 200,
              py: 1.5,
              px: 5,
              fontSize: 17,
              fontWeight: 600,
              borderRadius: 100,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
            onMouseEnter={() => router.prefetch(`${ROUTES.STATS}?demo=true`)}
            onClick={() => router.push(`${ROUTES.STATS}?demo=true`)}
          >
            View demo
          </Button>
        </Box>
      </Grid>
    </PageWrapper>
  )
}

export default Component
