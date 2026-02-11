import { z } from 'zod'

import { zColorMode, zUserLocale } from '@/types-enums'

import { zDateTimeString, zIdString, zNonEmptyString } from '../global'
import type { _KeysCheck } from '../key-check'
import { _zKeysCheck } from '../key-check'

export const zUserPreferences = z.object({
  locale: zUserLocale,
  colorMode: zColorMode,
  persistData: z.boolean(),
})

export type UserPreferences = z.infer<typeof zUserPreferences>

export const zUser = z.object({
  created: z.union([z.literal(''), zDateTimeString]),
  modified: z.union([z.literal(''), zDateTimeString]),
  id: z.union([z.literal(''), zIdString]),
  ...zUserPreferences.shape,
})

export type User = z.infer<typeof zUser>

export const zSyncableUser = z.object({
  ...zUser.shape,
  created: zDateTimeString,
  modified: zDateTimeString,
  id: zNonEmptyString,
})

export type SyncableUser = z.infer<typeof zSyncableUser>

export const zUserAtRest = z.object({
  ...zSyncableUser.shape,
})

export type UserAtRest = z.infer<typeof zUserAtRest>

// Safety checks
const assertKeys: _KeysCheck<User, UserAtRest> = true
_zKeysCheck(zUser, zUserAtRest, assertKeys)
