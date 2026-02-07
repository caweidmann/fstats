import { ZodDiscriminatedUnion, ZodIntersection, ZodObject, ZodRawShape, ZodUnion } from 'zod'

/**
 * This is a utility type which is solely there to ensure that when types
 * get created which need to be encrypted that they match the keys exactly.
 */
export const zKeysCheck = <T extends ZodRawShape, U extends ZodRawShape>(
  schemaA: ZodObject<T> | ZodUnion<any> | ZodDiscriminatedUnion<any, any> | ZodIntersection<any, any>,
  schemaB: ZodObject<U> | ZodUnion<any> | ZodDiscriminatedUnion<any, any> | ZodIntersection<any, any>,
  assertKeys: true,
): void => {
  const getKeys = (schema: any): string[] => {
    if (schema instanceof ZodObject) {
      return Object.keys(schema.shape)
    } else if (schema instanceof ZodUnion || schema instanceof ZodDiscriminatedUnion) {
      return schema.options.reduce((keys: string[], option: any) => {
        return [...keys, ...getKeys(option)]
      }, [])
    } else if (schema instanceof ZodIntersection) {
      const leftKeys = getKeys(schema._def.left)
      const rightKeys = getKeys(schema._def.right)
      return Array.from(new Set([...leftKeys, ...rightKeys]))
    }
    return []
  }

  const keysA = getKeys(schemaA)
  const keysB = getKeys(schemaB)

  const missingInA = keysB.filter((key) => !keysA.includes(key))
  const missingInB = keysA.filter((key) => !keysB.includes(key))

  if (assertKeys && !(missingInA.length === 0 && missingInB.length === 0)) {
    throw new Error(`Keys do not match: ${missingInA} + ${missingInB}`)
  }
}

/**
 * This is a utility type to check whether keys of two types match.
 */
export type KeysCheck<T, U> = keyof T extends keyof U ? (keyof U extends keyof T ? true : never) : never
