'use client'

import { Card } from '@mui/material'
import type { ChartData, ChartDataset } from 'chart.js'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'

import type { Size, StatsPageForm, Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { BarChart } from '@/components'
import { useUserPreferences } from '@/hooks'
import { getParserCurrency } from '@/parsers'
import { Big } from '@/lib/w-big'

import { getBackgroundColour, getBarThickness, getBorderRadius, getChartOptions } from './actions'
import { ui } from './styled'

type TransactionChartProps = {
  transactions: Transaction[]
}

const Component = ({ transactions }: TransactionChartProps) => {
  const { watch } = useFormContext<StatsPageForm>()
  const selectedId = watch('selectedId')
  const currency =
    selectedId && selectedId !== 'all' && selectedId !== 'unknown'
      ? getParserCurrency(selectedId)
      : selectedId && selectedId == 'all'
        ? transactions.length
          ? transactions[0].currency
          : Currency.USD // FIXME: This is just hacked, need to do better currency handling here
        : Currency.USD
  const { locale } = useUserPreferences()
  const sx = ui()
  const ref = useRef<HTMLDivElement>(null)
  const [{ width = 0 }, setSize] = useState<Size>({ width: undefined, height: undefined })

  useResizeObserver({
    ref: ref as RefObject<HTMLDivElement>,
    onResize: useDebounceCallback(setSize, 200),
  })

  const dataset: ChartDataset<'bar'> = {
    type: 'bar',
    label: 'Transactions',
    data: transactions.map((row) => Big(row.value).toNumber()),
    backgroundColor: getBackgroundColour,
    borderRadius: getBorderRadius,
    barThickness: getBarThickness({ transactions, chartWidth: width }),
    order: 2,
  }

  const chartData: ChartData = {
    labels: transactions.map((row) => row.date),
    datasets: [dataset],
  }

  const chartOptions = getChartOptions({ currency, locale })

  return (
    <Card sx={sx.chartCard} ref={ref}>
      {/* @ts-expect-error Type '"line"' is not assignable to type '"bar"'. */}
      <BarChart type="bar" data={chartData} options={chartOptions} />
    </Card>
  )
}

export default Component
