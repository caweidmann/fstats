import { ParentCategoryCode } from '@/types'

import { ALL_CATEGORIES } from '../Category/utils'

export const getCategories = () => {
  return ALL_CATEGORIES
}

export const getSubcategories = (parentCategoryCode: ParentCategoryCode) => {
  const parentCategory = ALL_CATEGORIES.find((category) => category.code === parentCategoryCode)
  return parentCategory ? parentCategory.subcategories : []
}

export const getAllSubcategories = () => {
  return ALL_CATEGORIES.flatMap((category) => category.subcategories)
}
