import type {
  CategoryCode,
  CategoryWithTransactions,
  SubcategoryCode,
  SubcategoryWithTransactions,
  Transaction,
} from '@/types'
import { getCategories } from '@/utils/Category'
import { Big } from '@/lib/w-big'

export const COL_SPACING = { xs: 1, sm: 2 }
export const COL1 = [4.5, 3]
export const COL2 = [4, 3]
export const COL3 = [2, 1]
export const COL4 = [1.5, 5]

export const getTransactionsByCategory = (
  transactions: Transaction[],
): Record<CategoryCode, CategoryWithTransactions> => {
  const categories: Record<CategoryCode, CategoryWithTransactions> = {}

  getCategories().forEach((category) => {
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

    console.log('transaction.category', transaction.category)
    const parentCode = transaction.category.split('_')[0]
    const parentCat = categories[parentCode]
    console.log('parentCat', parentCat)
    const subCat = parentCat.subcategories[transaction.category]

    parentCat.transactions.push(transaction)
    parentCat.total = Big(parentCat.total).plus(transaction.value).toString()

    subCat.transactions.push(transaction)
    subCat.total = Big(subCat.total).plus(transaction.value).toString()
  })

  return categories
}
