import type { NumberString } from '@/types'
import { Big } from '@/lib/w-big'

export const getDecimals = (value: NumberString): number => {
  return value.includes('.') ? value.split('.')[1].length : 0
}

export const getRoundedValue = (value: NumberString | '', round: number): NumberString => {
  if (!value) {
    return '0'
  }
  if (round < 0 || !Number.isInteger(round)) {
    throw new Error(`Round "${round}" must be a positive integer!`)
  }
  return getDecimals(value) <= round ? value : Big(value).toFixed(round)
}

export const parseGermanNumber = (numberString: string): string => {
  return numberString.replace(/\./g, '').replace(/,/g, '.')
}
