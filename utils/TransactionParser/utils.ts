import type { SubcategoryCode, Transaction } from '@/types'
import { Big } from '@/lib/w-big'

export const getSubcategoryCode = (row: Transaction): SubcategoryCode => {
  return Big(row.value).gte(0) ? 'INC_01' : 'HOU_01'
}
