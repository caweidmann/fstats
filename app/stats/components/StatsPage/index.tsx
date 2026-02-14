'use client'

import { Grid } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import type { StatsPageForm } from '@/types'
import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { getBankSelectOptions } from './actions'
import { BankSelector, DemoBanner } from './components'

const Component = () => {
  const { selectedFiles } = useFileHelper()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const bankOptions = getBankSelectOptions(isDemoMode ? [] : selectedFiles)
  const values: StatsPageForm = {
    selectedId: bankOptions.length ? bankOptions[0].value : '',
  }
  const methods = useForm<StatsPageForm>({
    defaultValues: values,
    values,
  })

  return (
    <FormProvider {...methods}>
      <PageWrapper>
        <Grid container spacing={3}>
          {isDemoMode ? (
            <Grid size={12}>
              <DemoBanner />
            </Grid>
          ) : null}

          {bankOptions.length ? (
            <Grid size={{ xs: 12, sm: 2 }}>
              <BankSelector options={bankOptions} />
            </Grid>
          ) : null}

          {/* <Grid size={2}>Date range</Grid> */}
          {/* <Grid size={2}>Display currency</Grid> */}
          {/* <Grid size={2}>Compress x-axis</Grid> */}
          {/* <Grid size={2}>Combine datasets</Grid> */}
          {/* <Grid size={12}>
          <ProfitLossCard isDemoMode={isDemoMode} transactions={allRows} />
        </Grid> */}
        </Grid>
      </PageWrapper>
    </FormProvider>
  )
}

export default Component
