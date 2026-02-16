import { z } from 'zod'

import { zCurrency } from '@/types-enums'

import { zNumberString, zSystemDateString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zTransaction = z.object({
  date: zSystemDateString,
  description: z.string(),
  value: zNumberString,
  currency: zCurrency,
  category: z.string(), // FIXME: type to porper cats
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
