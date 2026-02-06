import type { Theme } from '@mui/material/styles'
import type { ScriptableContext } from 'chart.js'

import type { GradientColors, GradientDirection } from '@/types'
import { ParserId } from '@/types-enums'
import { MISC } from '@/common'

import { AVAILABLE_PARSERS } from '../Parsers'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index])
}

export const getParserName = (value: ParserId): { short: string; long: string } => {
  if (!value) {
    return {
      short: 'Unknown',
      long: 'Unknown format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
    }
  }

  console.warn(`Unsupported parser ID: ${value}`)

  return {
    short: 'Unsupported',
    long: 'Unsupported format',
  }
}

export const parseGermanNumber = (numberString: string): string => {
  return numberString.replace(/\./g, '').replace(/,/g, '.')
}

export const getDefaultGradientColors = (theme: Theme, isDarkMode: boolean): GradientColors => {
  const startColor = isDarkMode ? theme.palette.background.default : '#f4f4f4'
  const endColor = isDarkMode ? theme.palette.primary.dark : theme.palette.secondary.light

  return {
    start: startColor,
    end: endColor,
  }
}

export const getGradient = ({
  context,
  colors,
  direction = 'horizontal',
  reverse = false,
}: {
  context: ScriptableContext<'line' | 'bar'>
  colors: GradientColors
  direction?: GradientDirection
  reverse?: boolean
}): CanvasGradient | 'currentcolor' => {
  const { chart } = context
  const { ctx, chartArea } = chart

  if (!chartArea) {
    return 'currentcolor'
  }

  const hStart = reverse ? chartArea.right : chartArea.left
  const hEnd = reverse ? chartArea.left : chartArea.right
  const vStart = reverse ? chartArea.top : chartArea.bottom
  const vEnd = reverse ? chartArea.bottom : chartArea.top

  const gradient =
    direction === 'horizontal'
      ? ctx.createLinearGradient(hStart, 0, hEnd, 0)
      : ctx.createLinearGradient(0, vStart, 0, vEnd)

  gradient.addColorStop(0, colors.start)
  gradient.addColorStop(1, colors.end)

  return gradient
}
