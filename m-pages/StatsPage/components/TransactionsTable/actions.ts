import { SubcategoryCode } from '@/types'

export const getCategoryColor = (category: SubcategoryCode) => {
  switch (true) {
    case category === 'Income':
      return 'success'
    case category.includes('Travel'):
      return 'info'
    case category.includes('Office'):
      return 'warning'
    default:
      return 'default'
  }
}
