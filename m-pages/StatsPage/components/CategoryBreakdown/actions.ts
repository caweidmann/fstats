import type { Transaction } from '@/types'
import { Big } from '@/lib/w-big'

type CategoryBreakdown = {
  name: string
  amount: number
  percentage: number
  color: string
}

export const getCategoryBreakdownData = (transactions: Transaction[]): CategoryBreakdown[] => {
  const categoryTotals = new Map<string, number>()

  transactions.forEach((transaction) => {
    const amount = Big(transaction.value).toNumber()

    const current = categoryTotals.get(transaction.category) || 0
    categoryTotals.set(transaction.category, current + Math.abs(amount))
  })

  const totalExpenses = Array.from(categoryTotals.values()).reduce((acc, val) => acc + val, 0)
  const sortedCategories = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])

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
