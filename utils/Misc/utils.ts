import { MISC } from '@/common'
import { AVAILABLE_PARSERS, ParserId } from '@/parsers'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const isEqual = (array1: string[], array2: string[]) => {
  return array1.length === array2.length && array1.every((value, index) => value.trim() === array2[index].trim())
}

export const getParserName = (value: ParserId | null): { short: string; long: string; alt: string } => {
  if (!value) {
    return {
      short: 'Unsupported',
      long: 'Unsupported format',
      alt: 'Unsupported format',
    }
  }

  const parser = AVAILABLE_PARSERS[value]

  if (parser) {
    return {
      short: parser.bankName,
      long: `${parser.bankName} ${MISC.CENTER_DOT} ${parser.accountType}`,
      alt: `${parser.bankName} / ${parser.accountType}`,
    }
  }

  console.warn(`Invalid parser ID: ${value}`)

  return {
    short: 'Invalid',
    long: 'Invalid parser',
    alt: 'Invalid parser',
  }
}
