import { ParserId } from '@/types-enums'
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

export const getParserName = (value: ParserId): { short: string; long: string } => {
  if (!value) {
    return {
      short: 'Unknown',
      long: 'Unknown format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
    }
  }

  console.warn(`Unsupported parser ID: ${value}`)

  return {
    short: 'Unsupported',
    long: 'Unsupported format',
  }
}

export const parseGermanNumber = (numberString: string): string => {
  return numberString.replace(/\./g, '').replace(/,/g, '.')
}
