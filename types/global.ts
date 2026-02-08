import type { ReactNode } from 'react'
import { z } from 'zod'

// See: https://github.com/mui/material-ui/issues/35910
import type {} from '@mui/material/themeCssVarsAugmentation'

import type { Big as TypeBig } from 'big.js'

export const zNonEmptyString = z.string().trim().nonempty({ error: 'ERRORS:REQUIRED' })
/**
 * The NonEmptyString ensure that there is a string value after being trimmed.
 */
export type NonEmptyString = z.infer<typeof zNonEmptyString>

// -------------------------------------------------------

export const zIdString = zNonEmptyString
/**
 * The IdString is a short-hand/proxy for readability purposes only.
 */
export type IdString = z.infer<typeof zIdString>

export const zDateRange = z.object({
  /** Start date of the interval */
  start: z.date(),
  /** End date of the interval */
  end: z.date().nullable(), // null allows dates in the future
})
/**
 * Interval of a period where start and end date are Date objects
 */
export type DateRange = z.infer<typeof zDateRange>

export const zDateTimeString = z.iso.datetime({ offset: true, error: 'ERRORS:INVALID_DATETIME' })
/**
 * The DateTimeString must be a string in the ISO date format,
 * i.e. "2020-01-01T00:00:00+02:00".
 *
 * For more info see: https://github.com/colinhacks/zod?tab=readme-ov-file#datetimes
 */
export type DateTimeString = z.infer<typeof zDateTimeString>

export const zSystemDateString = z.iso.date({ error: 'ERRORS:INVALID_DATE' })
/**
 * The SystemDateString must be a string in the MISC.SYSTEM_DATE_FORMAT = DateFormat.YMD_DASH format,
 * i.e. "2020-01-01".
 *
 * For more info see: https://github.com/colinhacks/zod?tab=readme-ov-file#dates
 */
export type SystemDateString = z.infer<typeof zSystemDateString>

export const zSelectOptionWithType = <T>(valueSchema: z.ZodType<T>) => {
  return z.object({
    value: valueSchema,
    label: z.custom<ReactNode>(),
    labelSecondary: z.custom<ReactNode>().optional(),
  })
}

export type SelectOptionWithType<T> = z.infer<ReturnType<typeof zSelectOptionWithType<T>>>

export const zSortOrder = z.enum(['asc', 'desc'])
export type SortOrder = z.infer<typeof zSortOrder>

export const zWeekStartsOnValue = z.union([z.literal(0), z.literal(1)])
/**
 * The WeekStartsOnValue can only be a number between 0 - 6 and in our case we only use Sunday or Monday,
 * i.e. 0 or 1.
 */
export type WeekStartsOnValue = z.infer<typeof zWeekStartsOnValue>

/**
 * Proxy for Big type.
 */
export type NumberBig = TypeBig

export type ChartDataPoint = {
  label: string
  value: number
}

export type ChartDataPointWithData<T> = ChartDataPoint & {
  data: T
}

export type GradientDirection = 'horizontal' | 'vertical'

export type GradientColors = {
  start: string
  end: string
}
