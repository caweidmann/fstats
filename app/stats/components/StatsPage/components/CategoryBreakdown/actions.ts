import type { ParsedContentRow } from '@/types'

type TransactionWithCategory = ParsedContentRow & {
  category?: string
  amount?: number
  value: { toNumber: () => number }
}

type CategoryBreakdown = {
  name: string
  amount: number
  percentage: number
  color: string
}

type GetCategoryBreakdownDataParams = TransactionWithCategory[]

export const getCategoryBreakdownData = (transactions: GetCategoryBreakdownDataParams): CategoryBreakdown[] => {
  // Aggregate expenses by category (exclude positive amounts as they're income)
  const categoryTotals = new Map<string, number>()

  transactions.forEach((transaction) => {
    const amount = transaction.value.toNumber()
    const category = (transaction as any).category

    // Only include negative amounts (expenses) and skip "Revenue" category
    if (amount < 0 && category && category !== 'Revenue') {
      const current = categoryTotals.get(category) || 0
      categoryTotals.set(category, current + Math.abs(amount))
    }
  })

  // Calculate total expenses
  const totalExpenses = Array.from(categoryTotals.values()).reduce((acc, val) => acc + val, 0)

  // Sort categories by amount (largest first)
  const sortedCategories = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])

  // Generate colors for each category
  const colors = [
    '#FF6384', // Red/Pink
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#66BB6A', // Green
    '#FFA726', // Light Orange
    '#EC407A', // Pink
    '#AB47BC', // Light Purple
  ]

  return sortedCategories.map(([name, amount], index) => ({
    name,
    amount,
    percentage: (amount / totalExpenses) * 100,
    color: colors[index % colors.length],
  }))
}
