import { SupportedParsers } from '@/types-enums'
import { MISC } from '@/common'

import { AVAILABLE_PARSERS } from '../Parsers'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index])
}

export const formatType = (type: SupportedParsers): { short: string; long: string } => {
  if (type === SupportedParsers.UNKNOWN) {
    return {
      short: 'Unknown',
      long: 'Unknown format',
    }
  }

  const parser = AVAILABLE_PARSERS[type]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
    }
  }

  console.warn(`Unsupported format type: ${type}`)

  return {
    short: 'Unsupported',
    long: 'Unsupported format',
  }
}

export const parseGermanNumber = (germanStr: string): string => {
  return germanStr.replace(/\./g, '').replace(/,/g, '.')
}
