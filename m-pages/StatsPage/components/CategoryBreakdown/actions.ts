import type {
  CategoryCode,
  CategoryWithTransactions,
  ParentCategoryCode,
  ParentCategoryWithTransactions,
  Transaction,
} from '@/types'
import { ALL_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

export type SortingPref = 'asc' | 'desc' | 'totalAsc' | 'totalDesc'

export const COL_SPACING = { xs: 1, sm: 2 }
export const COL1 = [4.5, 3]
export const COL2 = [3.2, 3]
export const COL3 = [2.3, 1]
export const COL4 = [2, 5]

export const getTransactionsGroupedByCategory = (transactions: Transaction[]): ParentCategoryWithTransactions[] => {
  const categories: Record<ParentCategoryCode, ParentCategoryWithTransactions> = {}

  Object.values(ALL_CATEGORIES).forEach((category) => {
    const subcategories: Record<CategoryCode, CategoryWithTransactions> = {}
    Object.values(category.subcategories).forEach((subcategory) => {
      subcategories[subcategory.code] = {
        ...subcategory,
        transactions: [],
        total: '0',
      }
    })

    categories[category.code] = {
      ...category,
      subcategories,
      transactions: [],
      total: '0',
    }
  })

  transactions.forEach((transaction) => {
    if (!transaction.category) {
      return
    }

    const parentCode = transaction.category.split('_')[0]
    const parentCategory = categories[parentCode]
    const category = parentCategory.subcategories[transaction.category]

    parentCategory.transactions.push(transaction)
    parentCategory.total = Big(parentCategory.total).plus(transaction.value).toString()

    category.transactions.push(transaction)
    category.total = Big(category.total).plus(transaction.value).toString()
  })

  return Object.values(categories)
}

export const sortTransactions = (transactions: ParentCategoryWithTransactions[], sortingPref: SortingPref) => {
  return transactions.sort((a, b) => {
    if (sortingPref === 'asc') {
      return a.label.localeCompare(b.label)
    }
    if (sortingPref === 'desc') {
      return b.label.localeCompare(a.label)
    }
    if (sortingPref === 'totalAsc') {
      return Big(a.total).minus(b.total).toNumber()
    }
    if (sortingPref === 'totalDesc') {
      return Big(b.total).minus(a.total).toNumber()
    }
    return 0
  })
}

export const getSortedCategoriesWithTransactions = (
  transactions: ParentCategoryWithTransactions[],
  categoriesToInclude: CategoryCode[],
  sortingPref: SortingPref,
): ParentCategoryWithTransactions[] => {
  return sortTransactions(
    transactions.filter((category) => categoriesToInclude.includes(category.code)),
    sortingPref,
  )
}
