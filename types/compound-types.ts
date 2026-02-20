import { z } from 'zod'

import { zNumberString } from './global'
import { zCategoryCode, zSubcategory, zSubcategoryCode, zTransaction } from './services/transaction'

export const zSubcategoryWithTransactions = z.object({
  ...zSubcategory.shape,
  transactions: z.array(zTransaction),
  total: zNumberString,
})

export type SubcategoryWithTransactions = z.infer<typeof zSubcategoryWithTransactions>

export const zCategoryWithTransactions = z.object({
  code: zCategoryCode,
  label: z.string(),
  subcategories: z.record(zSubcategoryCode, zSubcategoryWithTransactions),
  transactions: z.array(zTransaction),
  total: zNumberString,
})

export type CategoryWithTransactions = z.infer<typeof zCategoryWithTransactions>
