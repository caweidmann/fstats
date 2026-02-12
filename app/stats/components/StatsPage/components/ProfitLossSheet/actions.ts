import { format, parse, startOfMonth, startOfQuarter } from 'date-fns'

import type { ParsedContentRow } from '@/types'
import { DateFormat } from '@/types-enums'

import type { TransactionRow } from '../../demo-data'
import type { PeriodType, PLCategory, PLData, PLSection } from './types'

// Map categories to P&L line items
const CATEGORY_MAPPING: Record<string, { section: string; lineItem: string; parent?: string }> = {
  Revenue: { section: 'Income', lineItem: 'Revenue' },
  'Office & Rent': { section: 'Operating Expenses', lineItem: 'Rent & Facilities' },
  Materials: { section: 'Cost of Goods Sold', lineItem: 'Materials & Supplies' },
  'Professional Fees': { section: 'Operating Expenses', lineItem: 'Professional Fees' },
  Equipment: { section: 'Operating Expenses', lineItem: 'Equipment & Tools' },
  'Travel Expenses': { section: 'Operating Expenses', lineItem: 'Vehicle & Travel', parent: 'Vehicle Costs' },
  'Vehicle Costs': { section: 'Operating Expenses', lineItem: 'Vehicle & Travel', parent: 'Vehicle Costs' },
  Marketing: { section: 'Operating Expenses', lineItem: 'Marketing & Advertising' },
}

const getPeriodKey = (date: string, periodType: PeriodType, dateFormat: DateFormat): string => {
  const parsedDate = parse(date, dateFormat, new Date())

  if (periodType === 'monthly') {
    return format(startOfMonth(parsedDate), 'MMM yyyy').toUpperCase()
  } else {
    const quarter = startOfQuarter(parsedDate)
    const month = format(quarter, 'MMM').toUpperCase()
    const year = format(quarter, 'yyyy')
    const endMonth = format(new Date(quarter.getFullYear(), quarter.getMonth() + 2, 1), 'MMM').toUpperCase()
    return `${month} - ${endMonth} ${year}`
  }
}

export const transformDemoTransactions = (
  transactions: TransactionRow[],
  periodType: PeriodType,
  dateFormat: DateFormat,
): PLData => {
  // Group transactions by period and category
  const periodMap = new Map<string, Map<string, number>>()
  const allPeriods = new Set<string>()

  transactions.forEach((tx) => {
    const periodKey = getPeriodKey(tx.date, periodType, dateFormat)
    allPeriods.add(periodKey)

    if (!periodMap.has(periodKey)) {
      periodMap.set(periodKey, new Map())
    }

    const categoryMap = periodMap.get(periodKey)!
    const mapping = CATEGORY_MAPPING[tx.category] || {
      section: 'Other Expenses',
      lineItem: tx.category,
    }

    const key = `${mapping.section}::${mapping.lineItem}`
    const current = categoryMap.get(key) || 0
    categoryMap.set(key, current + tx.amount)
  })

  // Sort periods chronologically
  const periods = Array.from(allPeriods).sort((a, b) => {
    const dateA = parse(a.split(' - ')[0], 'MMM yyyy', new Date())
    const dateB = parse(b.split(' - ')[0], 'MMM yyyy', new Date())
    return dateA.getTime() - dateB.getTime()
  })

  // Build sections
  const sections: PLSection[] = []

  // Income Section
  const incomeCategories: PLCategory[] = []
  const revenueValues: Record<string, number> = {}
  let revenueTotal = 0

  periods.forEach((period) => {
    const categoryMap = periodMap.get(period)
    const revenue = categoryMap?.get('Income::Revenue') || 0
    revenueValues[period] = revenue
    revenueTotal += revenue
  })

  incomeCategories.push({
    name: 'Revenue',
    isParent: false,
    isSubItem: false,
    values: revenueValues,
    total: revenueTotal,
  })

  sections.push({
    title: 'Income',
    categories: incomeCategories,
    sectionTotal: revenueTotal,
  })

  // Cost of Goods Sold
  const cogsCategories: PLCategory[] = []
  const materialsValues: Record<string, number> = {}
  let materialsTotal = 0

  periods.forEach((period) => {
    const categoryMap = periodMap.get(period)
    const materials = Math.abs(categoryMap?.get('Cost of Goods Sold::Materials & Supplies') || 0)
    materialsValues[period] = materials
    materialsTotal += materials
  })

  if (materialsTotal > 0) {
    cogsCategories.push({
      name: 'Materials & Supplies',
      isParent: false,
      isSubItem: false,
      values: materialsValues,
      total: materialsTotal,
    })

    sections.push({
      title: 'Cost of Goods Sold',
      categories: cogsCategories,
      sectionTotal: materialsTotal,
    })
  }

  // Operating Expenses
  const expenseCategories: PLCategory[] = []
  const expenseKeys = new Set<string>()
  let expensesTotal = 0

  periodMap.forEach((categoryMap) => {
    categoryMap.forEach((_, key) => {
      if (key.startsWith('Operating Expenses::')) {
        expenseKeys.add(key)
      }
    })
  })

  Array.from(expenseKeys)
    .sort()
    .forEach((key) => {
      const lineItem = key.split('::')[1]
      const values: Record<string, number> = {}
      let total = 0

      periods.forEach((period) => {
        const categoryMap = periodMap.get(period)
        const amount = Math.abs(categoryMap?.get(key) || 0)
        values[period] = amount
        total += amount
      })

      expensesTotal += total

      expenseCategories.push({
        name: lineItem,
        isParent: false,
        isSubItem: false,
        values,
        total,
      })
    })

  if (expenseCategories.length > 0) {
    sections.push({
      title: 'Operating Expenses',
      categories: expenseCategories,
      sectionTotal: expensesTotal,
    })
  }

  // Calculate net profit
  const netProfit: Record<string, number> = {}
  let totalNetProfit = 0

  periods.forEach((period) => {
    const income = revenueValues[period] || 0
    const cogs = materialsValues[period] || 0
    let expenses = 0

    expenseCategories.forEach((cat) => {
      expenses += cat.values[period] || 0
    })

    const profit = income - cogs - expenses
    netProfit[period] = profit
    totalNetProfit += profit
  })

  return {
    periods,
    sections,
    netProfit,
    totalNetProfit,
  }
}

export const transformRealTransactions = (
  transactions: ParsedContentRow[],
  periodType: PeriodType,
  dateFormat: DateFormat,
): PLData => {
  // Group transactions by period
  const periodMap = new Map<string, { income: number; expenses: number }>()
  const allPeriods = new Set<string>()

  transactions.forEach((tx) => {
    const periodKey = getPeriodKey(tx.date, periodType, dateFormat)
    allPeriods.add(periodKey)

    if (!periodMap.has(periodKey)) {
      periodMap.set(periodKey, { income: 0, expenses: 0 })
    }

    const data = periodMap.get(periodKey)!
    const amount = tx.value.toNumber()

    if (amount > 0) {
      data.income += amount
    } else {
      data.expenses += Math.abs(amount)
    }
  })

  // Sort periods
  const periods = Array.from(allPeriods).sort((a, b) => {
    const dateA = parse(a.split(' - ')[0], 'MMM yyyy', new Date())
    const dateB = parse(b.split(' - ')[0], 'MMM yyyy', new Date())
    return dateA.getTime() - dateB.getTime()
  })

  // Build sections
  const sections: PLSection[] = []

  // Income
  const incomeValues: Record<string, number> = {}
  let incomeTotal = 0

  periods.forEach((period) => {
    const data = periodMap.get(period)!
    incomeValues[period] = data.income
    incomeTotal += data.income
  })

  sections.push({
    title: 'Income',
    categories: [
      {
        name: 'Revenue',
        isParent: false,
        isSubItem: false,
        values: incomeValues,
        total: incomeTotal,
      },
    ],
    sectionTotal: incomeTotal,
  })

  // Expenses
  const expenseValues: Record<string, number> = {}
  let expenseTotal = 0

  periods.forEach((period) => {
    const data = periodMap.get(period)!
    expenseValues[period] = data.expenses
    expenseTotal += data.expenses
  })

  sections.push({
    title: 'Expenses',
    categories: [
      {
        name: 'Total Expenses',
        isParent: false,
        isSubItem: false,
        values: expenseValues,
        total: expenseTotal,
      },
    ],
    sectionTotal: expenseTotal,
  })

  // Net profit
  const netProfit: Record<string, number> = {}
  let totalNetProfit = 0

  periods.forEach((period) => {
    const profit = incomeValues[period] - expenseValues[period]
    netProfit[period] = profit
    totalNetProfit += profit
  })

  return {
    periods,
    sections,
    netProfit,
    totalNetProfit,
  }
}
