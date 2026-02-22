import { CategoryCode } from '@/types'

export type KeywordRuleDirection = 'income' | 'expense'

export type KeywordCategoryRule = {
  income?: CategoryCode
  expense?: CategoryCode
}

export type KeywordRule = {
  keywords: string[]
  category: CategoryCode | KeywordCategoryRule
}

export const RAW_KEYWORD_RULES: KeywordRule[] = [
  { category: 'HOU_08', keywords: ['TELEKOM'] },

  { category: 'HOU_12', keywords: ['IKEA'] },

  { category: 'COM_02', keywords: ['CALUDE.AI', 'GITHUB'] },

  { category: 'TFR_02', keywords: ['Summe Monatsabrechnung Visa-Karte'] },

  { category: { expense: 'TFR_02', income: 'INC_13' }, keywords: ['Visa-Kartenabrechnung'] },
]

const toLowercaseKeywordRules = (rules: KeywordRule[]): KeywordRule[] => {
  return rules.map((rule) => ({
    ...rule,
    keywords: rule.keywords.map((keyword) => keyword.toLowerCase()),
  }))
}

export const KEYWORD_RULES = toLowercaseKeywordRules(RAW_KEYWORD_RULES)
