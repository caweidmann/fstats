import type { StatsFile, StatsFileAtRest, Transaction } from '@/types'
import { zSyncableStatsFile } from '@/types'
import { Currency } from '@/types-enums'
import { SHA256 } from '@/utils/Encryption'

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
    transactions: dataToParse.transactions.map((row) => ({
      ...row,
      currency: row.currency as Currency,
    })),
  }
  return res
}

export const encryptTransactions = async (rows: Transaction[]): Promise<string> => {
  const rowString = rows.map((row) => Object.values(row).join('|')).join('__')
  const encryptedHash = await SHA256.encrypt(rowString)
  return encryptedHash
}
