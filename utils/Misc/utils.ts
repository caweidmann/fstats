import { SupportedParsers } from '@/types-enums'
import { MISC } from '@/common'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index])
}

export const formatType = (type: SupportedParsers): { short: string; long: string } => {
  switch (type) {
    case SupportedParsers.UNKNOWN:
      return {
        short: 'Unknown',
        long: 'Unknown format',
      }
    case SupportedParsers.CAPITEC:
      return {
        short: 'Capitec',
        long: `Capitec ${MISC.CENTER_DOT} Savings`,
      }
    default:
      console.warn(`Unsupported format type: ${type}`)
      return {
        short: 'Unsupported',
        long: 'Unsupported format',
      }
  }
}
