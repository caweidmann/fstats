import { SupportedFormats } from '@/types-enums'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index])
}

export const formatType = (type: SupportedFormats) => {
  switch (type) {
    case SupportedFormats.UNKNOWN:
      return 'Unknown format'
    case SupportedFormats.CAPITEC:
      return 'Capitec'
    // case SupportedFormats.FNB:
    //   return 'FNB'
    // case SupportedFormats.COMDIRECT:
    //   return 'Comdirect'
    // case SupportedFormats.ING:
    //   return 'ING'
    default:
      console.warn(`Unsupported format type: ${type}`)
      return type
  }
}
