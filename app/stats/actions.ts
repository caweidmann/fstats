import type { SelectOptionWithType, StatsFile } from '@/types'
import { ParserId } from '@/types-enums'
import { AVAILABLE_PARSERS } from '@/utils/Parsers'

export const getBankSelectOptions = (selectedFiles: StatsFile[]): SelectOptionWithType<'all' | ParserId>[] => {
  const bankIds = selectedFiles.map((file) => file.parserId).filter((id): id is ParserId => id !== null)

  return [
    {
      label: 'All',
      value: 'all',
    },
    ...bankIds.map((id) => ({
      label: AVAILABLE_PARSERS[id].bankName,
      value: id,
    })),
  ]
}
