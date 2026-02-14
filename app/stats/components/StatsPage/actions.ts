import type { BankSelectOption, StatsFile } from '@/types'
import { ParserId } from '@/types-enums'
import { getParserName } from '@/utils/Misc'

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  const bankIds = Array.from(
    new Set(selectedFiles.map((file) => file.parserId).filter((id): id is ParserId => id !== null)),
  )

  const options: BankSelectOption[] = [
    ...bankIds.map((id) => ({
      label: getParserName(id).alt,
      value: id,
    })),
  ]

  // TODO: Add back when we have currency conversion logic in app
  // if (bankIds.length > 1) {
  //   options.unshift({
  //     label: 'All / Combined',
  //     value: 'all',
  //   })
  // }

  return options
}
