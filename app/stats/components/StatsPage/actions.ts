import { Theme } from '@mui/material/styles'
import type { ChartOptions } from 'chart.js'

import type { BankSelectOption, StatsFile } from '@/types'
import { Currency, ParserId, UserLocale } from '@/types-enums'
import { getParserName } from '@/utils/Misc'

export const calculateBarThickness = (isDemoMode: boolean, transactions: any[], isMobile: boolean) => {
  const transactionCount = isDemoMode ? 44 : transactions.length
  const baseWidth = isMobile ? 300 : 400
  const calculatedThickness = Math.floor(baseWidth / transactionCount)

  const minThickness = isMobile ? 2 : 3
  const maxThickness = isMobile ? 10 : 15

  return Math.max(minThickness, Math.min(maxThickness, calculatedThickness))
}

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  const bankIds = Array.from(
    new Set(selectedFiles.map((file) => file.parserId).filter((id): id is ParserId => id !== null)),
  )
  const unknownBankIds = selectedFiles.filter((file) => file.parserId === null)

  const options: BankSelectOption[] = [
    ...bankIds.map((id) => ({
      label: getParserName(id).long,
      value: id,
    })),
  ]

  if (bankIds.length + unknownBankIds.length > 1) {
    options.unshift({
      label: 'All',
      value: 'all',
    })
  }

  if (unknownBankIds.length) {
    options.push({
      label: 'Unknown',
      value: 'unknown',
    })
  }

  return options
}

export const getChartOptions = ({
  theme,
  isDarkMode,
  averageLabel,
  averageValue,
  currency,
  locale,
}: {
  theme: Theme
  isDarkMode: boolean
  averageLabel: string
  averageValue: number
  currency: Currency
  locale: UserLocale
}): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        align: 'start',
        onClick: () => {},
        labels: {
          boxHeight: 6,
          boxWidth: 6,
          useBorderRadius: true,
          borderRadius: 1,
          color: theme.palette.secondary.main,
          sort: (a, b) => {
            // Ensure the labels on the legend show in the order of how they appear in the datasets array,
            // this way `order` can be different on the dattaset, but the placing in the array can be used
            // to change where in the legend the dataset appears.
            return (a.datasetIndex || 0) - (b.datasetIndex || 0)
          },
        },
      },
      tooltip: {
        enabled: true,
        // callbacks: {
        //   label: function (context) {
        //     if (context.parsed.y !== null) {
        //       const value = context.parsed.y.toString()
        //       return `${context.dataset.label || ''}: ${toFixedLocaleCurrency(value, currency, locale, {
        //         rawItemPrice: value,
        //         isFractional: false,
        //         currencyFormat: 'symbol',
        //       })}`
        //     }
        //     return context.dataset.label
        //   },
        // },
      },
      // annotation: {
      //   annotations: {
      //     line1: {
      //       /**
      //        * NOTE: Do not use theme.vars here as CSS vars do not work with this plugin!
      //        */
      //       borderColor: isDarkMode ? theme.palette.divider : theme.palette.secondary.light,
      //       borderWidth: 1,
      //       borderDash: [2, 2],
      //       yMin: averageValue,
      //       yMax: averageValue,
      //       label: {
      //         display: true,
      //         content: averageLabel,
      //         padding: 5,
      //         backgroundColor: theme.palette.background.paper,
      //         borderColor: theme.palette.divider,
      //         borderWidth: 1,
      //         borderRadius: 8,
      //         color: isDarkMode ? theme.palette.secondary.dark : theme.palette.secondary.light,
      //         font: {
      //           size: 10,
      //         },
      //       },
      //     },
      //   },
      // },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        // ticks: {
        //   callback(value) {
        //     return toFixedLocaleCurrency(value.toString(), currency, locale, {
        //       rawItemPrice: value.toString(),
        //       isFractional: false,
        //       currencyFormat: 'symbol',
        //       trimTrailingZeros: true,
        //     })
        //   },
        // },
      },
    },
  }
}
