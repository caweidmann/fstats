'use client'

import { Box, Card, CardHeader, Grid, Typography } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import type { ChartData, ChartDataset, ScriptableContext } from 'chart.js'
import { parse } from 'date-fns'
import { useForm } from 'react-hook-form'

import { Currency } from '@/types-enums'
import { BarChart, PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper, useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'
import { getGradient } from '@/utils/Misc'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

import { getBankSelectOptions, getChartOptions } from './actions'
import { ProfitLoss } from './components'

type LocalForm = {
  selectedId: string
}

const Component = () => {
  const { locale } = useUserPreferences()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const { selectedFiles } = useFileHelper()
  const bankOptions = getBankSelectOptions(selectedFiles)
  const defaultValues: LocalForm = {
    selectedId: bankOptions[0].value,
  }
  const localForm = useForm<LocalForm>({ defaultValues })
  const selectedBankId = localForm.watch('selectedId')
  const filteredFiles =
    selectedBankId === 'all'
      ? selectedFiles
      : selectedBankId === 'unknown'
        ? selectedFiles.filter((file) => !file.parserId)
        : selectedFiles.filter((file) => file.parserId === selectedBankId)

  const allRows = filteredFiles
    .flatMap((file) => file.parsedContentRows)
    .sort((a, b) => {
      const dateA = parse(a.date, 'dd/MM/yyyy', new Date()).getTime()
      const dateB = parse(b.date, 'dd/MM/yyyy', new Date()).getTime()
      return dateA - dateB
    })

  const calculateBarThickness = () => {
    const transactionCount = allRows.length
    const baseWidth = isMobile ? 300 : 800
    const calculatedThickness = Math.floor(baseWidth / transactionCount)

    const minThickness = isMobile ? 2 : 3
    const maxThickness = isMobile ? 15 : 25

    return Math.max(minThickness, Math.min(maxThickness, calculatedThickness))
  }

  const dataset: ChartDataset<'bar'> = {
    type: 'bar',
    label: 'Transactions',
    data: allRows.map((row) => row.value.toNumber()),
    backgroundColor: (context) => {
      const value = context.parsed?.y ?? 0
      const isPositive = value >= 0

      return getGradient({
        context: context as ScriptableContext<'line' | 'bar'>,
        colors: {
          start: isPositive ? green[100] : red[200],
          end: isPositive ? green[600] : red[900],
        },
        direction: 'vertical',
      })
    },
    borderRadius: (context) => {
      const value = context.parsed?.y ?? 0
      const isPositive = value >= 0

      return isPositive
        ? { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 }
        : { topLeft: 0, topRight: 0, bottomLeft: 100, bottomRight: 100 }
    },
    barThickness: calculateBarThickness(),
    order: 2,
  }

  const chartData: ChartData = {
    labels: allRows.map((row) => row.date),
    datasets: [dataset],
  }

  const chartOptions = getChartOptions({
    theme,
    isDarkMode,
    averageLabel: '',
    averageValue: 0,
    currency: Currency.EUR,
    locale,
  })

  return (
    <PageWrapper>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 2 }}>
          <Select<LocalForm, LocalForm['selectedId']>
            control={localForm.control}
            name="selectedId"
            options={bankOptions}
            fullWidth
          />
        </Grid>
        {/* <Grid size={2}>Date range</Grid> */}
        {/* <Grid size={2}>Display currency</Grid> */}
        {/* <Grid size={2}>Compress x-axis</Grid> */}
        {/* <Grid size={2}>Combine datasets</Grid> */}

        <Grid size={12}>
          <ProfitLoss />
        </Grid>

        <Grid size={12}>
          <Card sx={{ height: 300, px: 3, pt: 4, pb: 3, borderRadius: 2 }}>
            {/* @ts-expect-error Type '"line"' is not assignable to type '"bar"'. */}
            <BarChart type="bar" data={chartData} options={chartOptions} />
          </Card>
        </Grid>

        {filteredFiles.map((file) => {
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

export default Component
