import { blueGrey, green, red } from '@mui/material/colors'
import { alpha } from '@mui/material/styles'
import type { ChartOptions } from 'chart.js'

import type { TransactionRangeItem } from '@/types'
import { Big } from '@/lib/w-big'

export const getChartColors = (isDarkMode: boolean) => {
  return {
    income: {
      start: isDarkMode ? alpha(green[50], 0.1) : green[50],
      end: green[600],
    },
    expenses: {
      start: isDarkMode ? alpha(red[50], 0.1) : red[50],
      end: red[700],
    },
    both: {
      start: isDarkMode ? alpha(blueGrey[50], 0.1) : blueGrey[50],
      end: blueGrey[700],
    },
  }
}

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'start',
      onClick: () => {},
      labels: {
        boxHeight: 6,
        boxWidth: 6,
        useBorderRadius: true,
        borderRadius: 1,
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        display: false,
        // maxTicksLimit: 3,
      },
    },
  },
}

export const getChartOptions = () => {
  return chartOptions
}

export const accumulateValues = (
  transactionRangeItems: TransactionRangeItem[],
  direction: 'income' | 'expenses' | 'both',
): number[] => {
  return transactionRangeItems.reduce((acc, item) => {
    const accTotal = acc[acc.length - 1] || 0
    const itemTotal = item.transactions.reduce((iacc, transaction) => {
      if (direction === 'income') {
        return Big(transaction.value).gte(0) ? Big(iacc).add(transaction.value).toNumber() : iacc
      } else if (direction === 'expenses') {
        return Big(transaction.value).lt(0) ? Big(iacc).add(Big(transaction.value).abs()).toNumber() : iacc
      } else {
        return Big(iacc).add(Big(transaction.value)).toNumber()
      }
    }, 0)

    acc.push(Big(accTotal).add(itemTotal).toNumber())

    return acc
  }, [] as number[])
}
