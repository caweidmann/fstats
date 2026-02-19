import { uniqBy } from 'lodash'

import type { BankSelectOption, StatsFile, StatsPageForm, Transaction } from '@/types'
import type { ParserId } from '@/types-enums'
import { MISC } from '@/common'
import { AVAILABLE_PARSERS, getParserName } from '@/utils/Parser'

export const getBankKey = (parserId: ParserId) => {
  const parser = AVAILABLE_PARSERS[parserId]
  return `${parser.bankName}__${parser.accountType}`
}

export const getCurrencyForSelection = (selectedId: StatsPageForm['selectedId'], transactions: Transaction[]) => {
  if (!selectedId || selectedId === 'all') {
    return transactions.length ? transactions[0].currency : MISC.DEFAULT_CURRENCY
  }

  const parser = Object.values(AVAILABLE_PARSERS).find(
    (parser) => `${parser.bankName}__${parser.accountType}` === selectedId,
  )

  return parser?.currency ?? MISC.DEFAULT_CURRENCY
}

export const getBankSelectOptions = (selectedFiles: StatsFile[]): BankSelectOption[] => {
  const banks = selectedFiles
    .filter((file) => file.parserId !== null)
    .map((file) => {
      const parser = AVAILABLE_PARSERS[file.parserId!]
      return {
        bankKey: getBankKey(file.parserId!),
        label: getParserName(file.parserId).alt,
        currency: parser.currency,
      }
    })

  const uniqueBanks = uniqBy(banks, 'bankKey')

  const options: BankSelectOption[] = uniqueBanks.map((bank) => ({
    label: bank.label,
    value: bank.bankKey,
  }))

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
