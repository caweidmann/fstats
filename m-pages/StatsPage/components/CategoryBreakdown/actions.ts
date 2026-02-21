import type {
  CategoryCode,
  CategoryWithTransactions,
  SubcategoryCode,
  SubcategoryWithTransactions,
  Transaction,
} from '@/types'
import { ALL_CATEGORIES } from '@/common'
import { Big } from '@/lib/w-big'

export type SortingPref = 'asc' | 'desc' | 'totalAsc' | 'totalDesc'

export const COL_SPACING = { xs: 1, sm: 2 }
export const COL1 = [4.5, 3]
export const COL2 = [4, 3]
export const COL3 = [2, 1]
export const COL4 = [1.5, 5]

export const getTransactionsByCategory = (
  transactions: Transaction[],
): Record<CategoryCode, CategoryWithTransactions> => {
  const categories: Record<CategoryCode, CategoryWithTransactions> = {}

  Object.values(ALL_CATEGORIES).forEach((category) => {
    const subcategories: Record<SubcategoryCode, SubcategoryWithTransactions> = {}
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
    const parentCat = categories[parentCode]
    const subCat = parentCat.subcategories[transaction.category]

    parentCat.transactions.push(transaction)
    parentCat.total = Big(parentCat.total).plus(transaction.value).toString()

    subCat.transactions.push(transaction)
    subCat.total = Big(subCat.total).plus(transaction.value).toString()
  })

  return categories
}

export const getSortedCategoriesWithTransactions = (
  transactions: Transaction[],
  categoriesToInclude: CategoryCode[],
  sortingPref: SortingPref,
): CategoryWithTransactions[] => {
  return Object.values(getTransactionsByCategory(transactions))
    .filter((category) => categoriesToInclude.includes(category.code))
    .sort((a, b) => {
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
