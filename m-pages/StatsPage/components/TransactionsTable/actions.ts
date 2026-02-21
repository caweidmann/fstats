import type { CategoryCode, GradientColorsLightDark, SubcategoryCode } from '@/types'
import { ALL_CATEGORIES, PARENT_CATEGORY_COLORS } from '@/common'

export const getSubcategoryLabel = (code: SubcategoryCode | null): string => {
  if (!code) {
    return 'Uncategorised'
  }

  const parentCode = code.split('_')[0] as CategoryCode
  const category = ALL_CATEGORIES[parentCode]

  if (!category) {
    return code
  }

  const subcategory = category.subcategories[code]
  return subcategory?.label ?? code
}

export const getCategoryColor = (code: SubcategoryCode | null): GradientColorsLightDark | undefined => {
  if (!code) {
    return
  }

  const parentCode = code.split('_')[0] as CategoryCode

  return PARENT_CATEGORY_COLORS[parentCode]
}
