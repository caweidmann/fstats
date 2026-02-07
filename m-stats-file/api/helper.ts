import type { StatsFile, StatsFileAtRest } from '@/types'
import { Big } from '@/lib/w-big'

export const syncStatsFile = (file: StatsFile): StatsFileAtRest => {
  const updatedFile: StatsFileAtRest = {
    ...file,
    parsedContentRows: file.parsedContentRows.map((row) => ({ ...row, value: row.value.toString() })),
  }
  return updatedFile
}

export const parseStatsFile = (file: StatsFileAtRest): StatsFile => {
  const updatedFile: StatsFile = {
    ...file,
    parsedContentRows: file.parsedContentRows.map((row) => ({ ...row, value: Big(row.value) })),
  }
  return updatedFile
}
