import { SupportedParsers } from '@/types-enums'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index])
}

export const formatType = (type: SupportedParsers) => {
  switch (type) {
    case SupportedParsers.UNKNOWN:
      return 'Unknown format'
    case SupportedParsers.CAPITEC:
      return 'Capitec'
    // case SupportedParsers.FNB:
    //   return 'FNB'
    // case SupportedParsers.COMDIRECT:
    //   return 'Comdirect'
    // case SupportedParsers.ING:
    //   return 'ING'
    default:
      console.warn(`Unsupported format type: ${type}`)
      return type
  }
}
