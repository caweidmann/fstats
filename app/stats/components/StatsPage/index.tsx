'use client'

import { Grid } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import type { StatsPageForm } from '@/types'
import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'
import { isFeatureEnabled } from '@/utils/Features'
import { isEqual, uniqWith } from '@/lib/w-lodash'

import { getBankSelectOptions } from './actions'
import { BankSelector, DemoBanner, ProfitLossSummary } from './components'

const Component = () => {
  const isWip = isFeatureEnabled('wip')
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
  const selectedId = methods.watch('selectedId')
  const filesForSelectedId =
    selectedId && selectedId !== 'all' && selectedId !== 'unknown'
      ? selectedFiles.filter((file) => file.parserId === selectedId)
      : selectedFiles
  const allTransactions = filesForSelectedId.flatMap((file) => file.parsedContentRows)
  const transactions = uniqWith(allTransactions, isEqual)

  return (
    <FormProvider {...methods}>
      <PageWrapper>
        <Grid container spacing={3}>
          {isWip ? (
            <Grid size={12}>
              <pre style={{ fontSize: 12, color: 'text.secondary' }}>
                Transactions: {allTransactions.length}
                <br />
                Duplicates: {allTransactions.length - transactions.length}
              </pre>
            </Grid>
          ) : null}

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

          <Grid size={12}>
            <ProfitLossSummary transactions={transactions} />
          </Grid>
        </Grid>
      </PageWrapper>
    </FormProvider>
  )
}

export default Component
