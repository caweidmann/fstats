'use client'

import { Grid } from '@mui/material'
import { isEqual, uniqWith } from 'lodash'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import type { StatsPageForm } from '@/types'
import { MISC } from '@/common'
import { PageWrapper } from '@/components'
import { useFileHelper } from '@/hooks'

import { getBankKey, getBankSelectOptions, getCurrencyForSelection } from './actions'
import {
  BankSelector,
  CategoryBreakdown,
  DemoBanner,
  ProfitLossSummary,
  TransactionChart,
  TransactionInfo,
  TransactionsTable,
} from './components'
import { DEMO_TRANSACTIONS } from './demo-data'

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
  const selectedId = methods.watch('selectedId')
  const filesForSelectedId =
    selectedId && selectedId === 'all'
      ? selectedFiles
      : selectedFiles.filter((file) => file.parserId && getBankKey(file.parserId) === selectedId)
  const allTransactions = isDemoMode ? DEMO_TRANSACTIONS : filesForSelectedId.flatMap((file) => file.transactions)
  const transactions = uniqWith(allTransactions, isEqual)
  const currency = getCurrencyForSelection(selectedId, transactions)

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

          {!isDemoMode ? (
            <Grid size="grow">
              <TransactionInfo
                total={allTransactions.length}
                duplicates={allTransactions.length - transactions.length}
              />
            </Grid>
          ) : null}

          {/* <Grid size={2}>Date range</Grid> */}
          {/* <Grid size={2}>Display currency</Grid> */}
          {/* <Grid size={2}>Compress x-axis</Grid> */}
          {/* <Grid size={2}>Combine datasets</Grid> */}

          <Grid size={12}>
            <ProfitLossSummary transactions={transactions} currency={currency} />
          </Grid>

          <Grid size={12}>
            <TransactionChart transactions={transactions} currency={currency} />
          </Grid>

          <Grid size={12}>
            <CategoryBreakdown transactions={transactions} currency={currency} />
          </Grid>

          <Grid size={12}>
            <TransactionsTable transactions={transactions} currency={currency} />
          </Grid>
        </Grid>
      </PageWrapper>
    </FormProvider>
  )
}

export default Component
