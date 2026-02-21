import type { CategoryCode, Transaction } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

export const getCategoryCode = (row: Transaction): CategoryCode => {
  const incomeCats: CategoryCode[] = Object.keys(INCOME_CATEGORIES).flatMap((catCode) =>
    Object.keys(INCOME_CATEGORIES[catCode].subcategories),
  )
  const expenseCats: CategoryCode[] = Object.keys(EXPENSE_CATEGORIES).flatMap((catCode) =>
    Object.keys(EXPENSE_CATEGORIES[catCode].subcategories),
  )

  const incomeIndex = Math.floor(Math.random() * incomeCats.length)
  const expenseIndex = Math.floor(Math.random() * expenseCats.length)

  return Big(row.value).gte(0) ? incomeCats[incomeIndex] : expenseCats[expenseIndex]
}
