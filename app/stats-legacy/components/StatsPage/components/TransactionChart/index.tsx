'use client'

import { Card } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import type { ChartData, ChartDataset, ScriptableContext } from 'chart.js'

import type { ParsedContentRow } from '@/types'
import { Currency } from '@/types-enums'
import { BarChart } from '@/components'
import { useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'
import { getGradient } from '@/utils/Misc'

import { calculateBarThickness, getChartOptions } from '../../actions'
import { getDemoChartData } from '../../demo-data'
import { ui } from './styled'

type ComponentProps = {
  isDemoMode: boolean
  transactions: ParsedContentRow[]
}

const Component = ({ isDemoMode, transactions }: ComponentProps) => {
  const { locale } = useUserPreferences()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui()
  const barThickness = calculateBarThickness(isDemoMode, transactions, isMobile)

  const dataset: ChartDataset<'bar'> = {
    type: 'bar',
    label: 'Transactions',
    data: transactions.map((row) => row.value.toNumber()),
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
    barThickness,
    order: 2,
  }

  const chartData: ChartData = isDemoMode
    ? getDemoChartData({ isDemoMode, isMobile, isDarkMode, transactions })
    : {
        labels: transactions.map((row) => row.date),
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
    <Card sx={sx.chartCard}>
      {/* @ts-expect-error Type '"line"' is not assignable to type '"bar"'. */}
      <BarChart type="bar" data={chartData} options={chartOptions} />
    </Card>
  )
}

export default Component
