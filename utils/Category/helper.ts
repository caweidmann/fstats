import type { Category, CategoryCode, Subcategory } from '@/types'

import { ALL_CATEGORIES } from '../Category/utils'

export const getCategories = (): Category[] => {
  return Object.values(ALL_CATEGORIES)
}

export const getSubcategoriesFor = (categoryCode: CategoryCode): Subcategory[] => {
  return Object.values(ALL_CATEGORIES[categoryCode].subcategories)
}

export const getSubcategories = (): Subcategory[] => {
  return getCategories().flatMap((category) => Object.values(category.subcategories))
}
