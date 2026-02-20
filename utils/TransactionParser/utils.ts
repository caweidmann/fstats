import { Big } from '@/lib/w-big'

export const getCategory = (row: any) => {
  return Big(row.value).gte(0) ? 'Income' : 'Expense'
}
