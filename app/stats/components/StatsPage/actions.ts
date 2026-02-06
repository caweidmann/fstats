import type { BankSelectOption, StatsFile } from '@/types'
import { ParserId } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  const bankIds = Array.from(
    new Set(selectedFiles.map((file) => file.parserId).filter((id): id is ParserId => id !== null)),
  )
  const unknownBankIds = selectedFiles.filter((file) => file.parserId === null)

  const options: BankSelectOption[] = [
    ...bankIds.map((id) => ({
      label: AVAILABLE_PARSERS[id].bankName,
      value: id,
    })),
  ]

  if (bankIds.length + unknownBankIds.length > 1) {
    options.unshift({
      label: 'All',
      value: 'all',
    })
  }

  if (unknownBankIds.length) {
    options.push({
      label: 'Unknown',
      value: 'unknown',
    })
  }

  return options
}
