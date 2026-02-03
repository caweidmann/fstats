'use client'

import { Grid, Typography } from '@mui/material'

import { PageWrapper } from '@/components'
import { useTranslation } from '@/lib/i18n'

const Page = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography color="primary" variant="body2" sx={{ fontWeight: 'bold', fontSize: 40 }}>
            404
          </Typography>
          <Typography color="primary" variant="body2" sx={{ fontWeight: 'bold', fontSize: 20 }}>
            {t('PAGE_404.TITLE')}
          </Typography>
          <Typography color="secondary" variant="body2" sx={{ mb: 4 }}>
            {t('PAGE_404.BLURB')}
          </Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Page
