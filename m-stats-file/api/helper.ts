import type { StatsFile, StatsFileAtRest } from '@/types'
import { zSyncableStatsFile } from '@/types'
import { Currency } from '@/types-enums'

export const syncStatsFile = (dataToSync: StatsFile): StatsFileAtRest => {
  const res = zSyncableStatsFile.safeParse(dataToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    throw new Error(`Cannot sync StatsFile: ${errors}`)
  }

  return res.data
}

export const parseStatsFile = (dataToParse: StatsFileAtRest): StatsFile => {
  const res: StatsFile = {
    ...dataToParse,
    parsedContentRows: dataToParse.parsedContentRows.map((row) => ({
      ...row,
      currency: row.currency as Currency,
    })),
  }
  return res
}
