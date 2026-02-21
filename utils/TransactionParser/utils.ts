import type { CategoryCode, Transaction } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { isFeatureEnabled } from '@/utils/Features'
import { Big } from '@/lib/w-big'

const isWip = isFeatureEnabled('wip')

// FIXME: Do not randomise! Use actual logic
export const getCategoryCode = (row: Transaction): CategoryCode => {
  if (isWip) {
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

  return Big(row.value).gte(0) ? 'INC_10' : 'TFR_05'
}
