export type PeriodType = 'monthly' | 'quarterly'

export type PLCategory = {
  name: string
  isParent: boolean
  isSubItem: boolean
  values: Record<string, number> // period -> amount
  total: number
}

export type PLSection = {
  title: string
  categories: PLCategory[]
  sectionTotal: number
}

export type PLData = {
  periods: string[] // e.g., ['JAN 2026', 'FEB 2026'] or ['JAN - MAR 2026', 'APR - JUN 2026']
  sections: PLSection[]
  netProfit: Record<string, number>
  totalNetProfit: number
}
