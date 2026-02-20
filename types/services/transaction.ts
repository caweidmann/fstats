import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zDateTimeString, zNumberString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zTransaction = z.object({
  date: zDateTimeString,
  description: z.string(),
  value: zNumberString,
  currency: zCurrency,
  category: z.string(), // FIXME: type to porper cats
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
