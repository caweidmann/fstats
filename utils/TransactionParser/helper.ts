import type { KeywordRule } from '@/types'

export const RAW_INCOME_KEYWORD_RULES: KeywordRule[] = [
  // { category: 'INC', keywords: [] },

  { category: 'PAS_03', keywords: ['Interest Received'] },

  // { category: 'OTH', keywords: [] },

  { category: 'TFI_01', keywords: ['Visa-Kartenabrechnung'] },
]

export const RAW_EXPENSE_KEYWORD_RULES: KeywordRule[] = [
  { category: 'HOU_03', keywords: ['TELEKOM'] },
  { category: 'HOU_07', keywords: ['IKEA'] },

  // { category: 'TRN', keywords: [] },

  // { category: 'GRO', keywords: [] },

  // { category: 'HLT', keywords: [] },

  // { category: 'FAM', keywords: [] },

  { category: 'FIN_05', keywords: ['Monthly Account Admin Fee', 'International Processing Card Purchase Fee'] },

  { category: 'BUS_03', keywords: ['CALUDE.AI', 'GITHUB'] },

  { category: 'TFO_01', keywords: ['Summe Monatsabrechnung Visa-Karte', 'Internet Banking Transfer'] },
]

const toLowercaseKeywordRules = (rules: KeywordRule[]): KeywordRule[] => {
  return rules.map((rule) => ({
    ...rule,
    keywords: rule.keywords.map((keyword) => keyword.toLowerCase()),
  }))
}

export const INCOME_KEYWORD_RULES = toLowercaseKeywordRules(RAW_INCOME_KEYWORD_RULES)
export const EXPENSE_KEYWORD_RULES = toLowercaseKeywordRules(RAW_EXPENSE_KEYWORD_RULES)
