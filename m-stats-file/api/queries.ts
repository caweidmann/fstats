import type { StatsFile, StatsFileAtRest } from '@/types'
import { db } from '@/lib/localforage'

import { parseStatsFile, syncStatsFile } from './helper'

export const addFile = async (ssfile: StatsFile): Promise<StatsFile> => {
  await db.filesStore.setItem<StatsFileAtRest>(ssfile.id, syncStatsFile(ssfile))
  return ssfile
}

export const getFile = async (id: string): Promise<StatsFile | null> => {
  if (!id) {
    throw new Error('No ID!')
  }
  const ssfile = await db.filesStore.getItem<StatsFileAtRest>(id)
  return ssfile ? parseStatsFile(ssfile) : null
}
