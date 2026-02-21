import type { SubcategoryCode, Transaction } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

export const getSubcategoryCode = (row: Transaction): SubcategoryCode => {
  const incomeCats: SubcategoryCode[] = Object.keys(INCOME_CATEGORIES).flatMap((catCode) =>
    Object.keys(INCOME_CATEGORIES[catCode].subcategories),
  )
  const expenseCats: SubcategoryCode[] = Object.keys(EXPENSE_CATEGORIES).flatMap((catCode) =>
    Object.keys(EXPENSE_CATEGORIES[catCode].subcategories),
  )

  const incomeIndex = Math.floor(Math.random() * incomeCats.length)
  const expenseIndex = Math.floor(Math.random() * expenseCats.length)

  return Big(row.value).gte(0) ? incomeCats[incomeIndex] : expenseCats[expenseIndex]
}
