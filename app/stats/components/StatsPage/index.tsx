'use client'

import { Box, Card, CardHeader, Grid } from '@mui/material'
import { green } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import type { ChartData, ChartDataset } from 'chart.js'
import { useForm } from 'react-hook-form'

import { Currency } from '@/types-enums'
import { BarChart, PageWrapper } from '@/components'
import { Select } from '@/components/FormFieldsControlled'
import { useFileHelper, useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'
import { getGradient, toRgba } from '@/utils/Misc'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

import { getBankSelectOptions, getChartOptions } from './actions'

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

  const dataset: ChartDataset<'bar' | 'line'> = {
    type: 'bar',
    label: 'Cool dataset',
    data: [10, 20],
    backgroundColor: (context) =>
      getGradient({
        // @ts-expect-error Type '"line"' is not assignable to type '"bar"'.
        context,
        colors: {
          start: isDarkMode ? toRgba(green[50], 0.1) : green[50],
          end: green[600],
        },
        direction: 'vertical',
      }),
    borderRadius: { topLeft: 100, topRight: 100 },
    barThickness: isMobile ? 11 : 20,
    order: 2,
  }

  const chartData: ChartData = {
    labels: ['asd', 'xyz'],
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
      <Grid container spacing={2}>
        <Grid size={2}>
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
          <Card sx={{ height: 300, px: 3, pt: 4, pb: 2 }}>
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
