import type { KeywordRule } from '@/types'

export const RAW_INCOME_KEYWORD_RULES: KeywordRule[] = [
  { category: 'PAS_03', keywords: ['Interest Received'] },
  { category: 'TFI_01', keywords: ['Visa-Kartenabrechnung'] },
]

export const RAW_EXPENSE_KEYWORD_RULES: KeywordRule[] = [
  { category: 'HOU_08', keywords: ['TELEKOM'] },

  { category: 'HOU_12', keywords: ['IKEA'] },

  { category: 'COM_02', keywords: ['CALUDE.AI', 'GITHUB'] },

  { category: 'TFO_02', keywords: ['Summe Monatsabrechnung Visa-Karte'] },

  { category: 'FIN_05', keywords: ['Monthly Account Admin Fee'] },
]

const toLowercaseKeywordRules = (rules: KeywordRule[]): KeywordRule[] => {
  return rules.map((rule) => ({
    ...rule,
    keywords: rule.keywords.map((keyword) => keyword.toLowerCase()),
  }))
}

export const INCOME_KEYWORD_RULES = toLowercaseKeywordRules(RAW_INCOME_KEYWORD_RULES)
export const EXPENSE_KEYWORD_RULES = toLowercaseKeywordRules(RAW_EXPENSE_KEYWORD_RULES)
