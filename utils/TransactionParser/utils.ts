import type { CategoryCode, Transaction } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

import type { KeywordRuleDirection } from './helper'
import { KEYWORD_RULES } from './helper'

const useRandomizer = false

export const getCategoryCode = (row: Transaction): CategoryCode => {
  const isIncome = Big(row.value).gte(0)
  const direction: KeywordRuleDirection = isIncome ? 'income' : 'expense'

  if (useRandomizer) {
    const incomeCats: CategoryCode[] = Object.keys(INCOME_CATEGORIES).flatMap((catCode) =>
      Object.keys(INCOME_CATEGORIES[catCode].subcategories),
    )
    const expenseCats: CategoryCode[] = Object.keys(EXPENSE_CATEGORIES).flatMap((catCode) =>
      Object.keys(EXPENSE_CATEGORIES[catCode].subcategories),
    )

    const incomeIndex = Math.floor(Math.random() * incomeCats.length)
    const expenseIndex = Math.floor(Math.random() * expenseCats.length)

    return isIncome ? incomeCats[incomeIndex] : expenseCats[expenseIndex]
  }

  const description = row.description.toLowerCase()
  let matchedCategory: CategoryCode | null = null
  let matchedKeywordLength = -1

  for (const rule of KEYWORD_RULES) {
    const category = typeof rule.category === 'string' ? rule.category : (rule.category[direction] ?? null)

    if (!category) {
      continue
    }

    for (const keyword of rule.keywords) {
      // Prefer the most specific (longest) matching keyword over shorter matches
      if (description.includes(keyword) && keyword.length > matchedKeywordLength) {
        matchedCategory = category
        matchedKeywordLength = keyword.length
      }
    }
  }

  if (matchedCategory) {
    return matchedCategory
  }

  if (isIncome) {
    return 'INC_10'
  }

  return 'TFR_05'
}
