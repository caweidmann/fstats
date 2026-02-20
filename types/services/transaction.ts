import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zDateTimeString, zNumberString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zCategoryCode = z.string().regex(/^[A-Z]{3}$/)
export const zSubcategoryCode = z.string().regex(/^[A-Z]{3}_\d{2}$/)

export type CategoryCode = z.infer<typeof zCategoryCode>
export type SubcategoryCode = z.infer<typeof zSubcategoryCode>

export const zSubcategory = z.object({
  code: zSubcategoryCode,
  label: z.string(),
})

export type Subcategory = z.infer<typeof zSubcategory>

export const zCategory = z.object({
  code: zCategoryCode,
  label: z.string(),
  subcategories: z.record(zSubcategoryCode, zSubcategory),
})

export type Category = z.infer<typeof zCategory>

export const zTransaction = z.object({
  date: zDateTimeString,
  description: z.string(),
  value: zNumberString,
  currency: zCurrency,
  category: zSubcategoryCode.nullable(),
  extra: z
    .object({
      parentCategory: z.string().optional(), // Capitec (parentCategory)
      category: z.string().optional(), // Capitec (category)
      balance: zNumberString.optional(), // Capitec (balance), FNB (balance), ING (saldo), Lloyds (balance)
      reference: z.string().optional(), // Comdirect Visa (referenz), ING (verwendungszweck)
      transactionType: z.string().optional(), // Comdirect Giro & Visa (vorgang), ING (buchungstext)
    })
    .nullable(),
})

export type Transaction = z.infer<typeof zTransaction>

export const zTransactionAtRest = z.object({
  ...zTransaction.shape,
  currency: z.string(),
})

export type TransactionAtRest = z.infer<typeof zTransactionAtRest>

// Safety checks
const assertKeys: _KeysCheck<Transaction, TransactionAtRest> = true
_zKeysCheck(zTransaction, zTransactionAtRest, assertKeys)
