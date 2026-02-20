import type { SubcategoryCode, Transaction } from '@/types'
import { ALL_CATEGORIES, getSubcategories } from '@/utils/Category'
import { Big } from '@/lib/w-big'

export const getSubcategoryCode = (row: Transaction): SubcategoryCode => {
  const incomeCats: SubcategoryCode[] = Object.keys(ALL_CATEGORIES.INC.subcategories)
  const incomeIndex = Math.floor(Math.random() * incomeCats.length)
  const expenseCats: SubcategoryCode[] = getSubcategories()
    .map((category) => category.code)
    .filter((code) => !code.startsWith('INC'))
  const expenseIndex = Math.floor(Math.random() * expenseCats.length)

  return Big(row.value).gte(0) ? incomeCats[incomeIndex] : expenseCats[expenseIndex]
}
