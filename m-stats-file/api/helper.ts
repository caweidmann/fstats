import type { StatsFile, StatsFileAtRest } from '@/types'
import { zSyncableStatsFile } from '@/types'
import { Big } from '@/lib/w-big'

export const syncStatsFile = (fileToSync: StatsFile): StatsFileAtRest => {
  const res = zSyncableStatsFile.safeParse(fileToSync)

  if (!res.success) {
    const errors = res.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    throw new Error(`Cannot sync StatsFile: ${errors}`)
  }

  return {
    ...res.data,
    parsedContentRows: res.data.parsedContentRows.map((row) => ({ ...row, value: row.value.toString() })),
  }
}

export const parseStatsFile = (fileToParse: StatsFileAtRest): StatsFile => {
  const res: StatsFile = {
    ...fileToParse,
    parsedContentRows: fileToParse.parsedContentRows.map((row) => ({ ...row, value: Big(row.value) })),
  }
  return res
}
