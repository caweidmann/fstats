'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { parse } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper, useIsMobile } from '@/hooks'
import { isFeatureEnabled } from '@/utils/Features'

import { getBankSelectOptions } from './actions'
import {
  CategoryBreakdown,
  ProfitLossCard,
  ProfitLossSheet,
  TaxOptimizationInsights,
  TransactionChart,
  TransactionsTable,
} from './components'

type LocalForm = {
  selectedId: string
}

const Component = () => {
  const isMobile = useIsMobile()
  const { selectedFiles } = useFileHelper()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isDemoMode = searchParams.get('demo') === 'true'
  const isWip = isFeatureEnabled('wip')
  const bankOptions = isDemoMode ? [] : getBankSelectOptions(selectedFiles)
  const defaultValues: LocalForm = {
    selectedId: bankOptions[0]?.value || 'all',
  }
  const localForm = useForm<LocalForm>({ defaultValues })
  const selectedBankId = localForm.watch('selectedId')
  const filteredFiles = isDemoMode
    ? []
    : selectedBankId === 'all'
      ? selectedFiles
      : selectedBankId === 'unknown'
        ? selectedFiles.filter((file) => !file.parserId)
        : selectedFiles.filter((file) => file.parserId === selectedBankId)

  const allRows = isDemoMode
    ? []
    : filteredFiles
        .flatMap((file) => file.parsedContentRows)
        .sort((a, b) => {
          const dateA = parse(a.date, 'dd/MM/yyyy', new Date()).getTime()
          const dateB = parse(b.date, 'dd/MM/yyyy', new Date()).getTime()
          return dateA - dateB
        })

  return (
    <PageWrapper>
      {isDemoMode && (
        <Box
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            py: 1.5,
            px: 3,
            mb: 3,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1.5 : 0,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0 }}>
            You are viewing demo data
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => router.push(ROUTES.DATA)}
          >
            Upload your data
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {!isDemoMode && (
          <Grid size={{ xs: 12, sm: 2 }}>
            <Select<LocalForm, LocalForm['selectedId']>
              control={localForm.control}
              name="selectedId"
              options={bankOptions}
              fullWidth
              sx={{ borderRadius: 1.5 }}
            />
          </Grid>
        )}
        {/* <Grid size={2}>Date range</Grid> */}
        {/* <Grid size={2}>Display currency</Grid> */}
        {/* <Grid size={2}>Compress x-axis</Grid> */}
        {/* <Grid size={2}>Combine datasets</Grid> */}

        <Grid size={12}>
          <ProfitLossCard isDemoMode={isDemoMode} transactions={allRows} />
        </Grid>

        <Grid size={12}>
          <TransactionChart isDemoMode={isDemoMode} transactions={allRows} />
        </Grid>

        {isWip ? (
          <Grid size={12}>
            <CategoryBreakdown isDemoMode={isDemoMode} transactions={allRows} />
          </Grid>
        ) : null}

        {isWip ? (
          <Grid size={12}>
            <ProfitLossSheet isDemoMode={isDemoMode} transactions={allRows} />
          </Grid>
        ) : null}

        <Grid size={12}>
          <TaxOptimizationInsights isDemoMode={isDemoMode} />
        </Grid>

        <Grid size={12}>
          <TransactionsTable isDemoMode={isDemoMode} transactions={allRows} selectedCategory={null} />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Component
