import type { CategoryCode, Transaction } from '@/types'
import { Big } from '@/lib/w-big'

export const getCategory = (row: Transaction): CategoryCode => {
  return Big(row.value).gte(0) ? 'INC-01' : 'HOU-01'
}
