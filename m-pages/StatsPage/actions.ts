import type { BankSelectOption, StatsFile } from '@/types'
import { ParserId } from '@/types-enums'
import { getParserName } from '@/utils/Misc'
import { getParserCurrency } from '@/parsers'
import { isEqual, uniqWith } from '@/lib/w-lodash'

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  const banks = selectedFiles
    .filter((file) => file.parserId !== null)
    .map((file) => ({
      parserId: file.parserId,
      currency: file.parserId ? getParserCurrency(file.parserId) : null,
    }))
  const uniqueBanks = uniqWith(banks, isEqual)
  const bankIds = uniqueBanks.map((bank) => bank.parserId) as ParserId[]
  const options: BankSelectOption[] = [
    ...bankIds.map((id) => ({
      label: getParserName(id).alt,
      value: id,
    })),
  ]

  options.sort((a, b) => a.value.localeCompare(b.value))

  // Only add "All / Combined" when uniqueBanks have exactly the same currency
  // TODO: Once we have currency conversion logic "All" should always be available
  if (uniqueBanks.length > 1) {
    const allSameCurrency = uniqueBanks.every((bank) => bank.currency === uniqueBanks[0].currency)
    if (allSameCurrency) {
      options.unshift({
        label: 'All accounts',
        value: 'all',
      })
    }
  }

  return options
}
