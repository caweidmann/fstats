import type { Locale } from 'date-fns'
import type { ReactNode } from 'react'
import { z } from 'zod'

import { ColorMode, UserLocale } from '@/types-enums'

export type UserPreferences = {
  locale: UserLocale
  colorMode: ColorMode
  persistData: boolean
}

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>

export type Breadcrumb = {
  label: string
  route?: string | undefined
}

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
