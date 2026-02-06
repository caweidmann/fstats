'use client'

import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper, useIsDarkMode, useIsMobile } from '@/hooks'
import { Color } from '@/styles/colors'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

type BankIds = {
  selectedId: string
}

const StatsPage = () => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const { selectedFiles } = useFileHelper()
  console.log('selectedFiles', selectedFiles)
  const banks = selectedFiles.map((file) => file.parserId)
  console.log('banks', banks)

  const defaultValues: BankIds = {
    selectedId: '',
  }
  const localForm = useForm<BankIds>({ defaultValues })
  const bankOptions = [
    {
      label: 'All',
      value: '0_sdays',
    },
    {
      label: 'Capitec',
      value: '0_days',
    },
    {
      label: 'Comdirect',
      value: '7_days',
    },
  ]

  const selectedBankId = localForm.watch('selectedId')
  console.log('selectedBankId', selectedBankId)

  if (!selectedFiles.length) {
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
          <Button
            variant="contained"
            size="large"
            sx={{ minWidth: 200, py: 1.5, px: 5, fontSize: 17, fontWeight: 600, borderRadius: 100 }}
            onMouseEnter={() => router.prefetch(ROUTES.DATA)}
            onClick={() => router.push(ROUTES.DATA)}
          >
            Upload files
          </Button>
        </Grid>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">Stats</Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onMouseEnter={() => router.prefetch(ROUTES.DATA)}
              onClick={() => router.push(ROUTES.DATA)}
            >
              Back
            </Button>
          </Box>
        </Grid>

        <Grid size={2}>
          <Select<BankIds, BankIds['selectedId']>
            control={localForm.control}
            name="selectedId"
            options={bankOptions}
            fullWidth
          />
        </Grid>
        <Grid size={2}>Date range</Grid>
        <Grid size={2}>Display currency</Grid>
        <Grid size={2}>Compress x-axis</Grid>
        <Grid size={2}>Combine datasets</Grid>

        {selectedFiles.map((file) => {
          const rowCount = file.parserId ? file.parsedContentRows.length : file.rawParseResult?.data.length
          const columnCount = file.parserId
            ? AVAILABLE_PARSERS[file.parserId].expectedHeaders.length
            : file.rawParseResult?.data[0]?.length

          return (
            <Grid key={file.id} size={12}>
              <Card>
                <CardHeader title={file.file.name} subheader={`${rowCount} rows, ${columnCount} columns`} />
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </PageWrapper>
  )
}

export default StatsPage
