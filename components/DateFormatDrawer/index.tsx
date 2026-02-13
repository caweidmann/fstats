'use client'

import { List } from '@mui/material'

import { DateFormat } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { getDateFormatSelectOptions, toDisplayDate } from '@/utils/Date'

import { DateFormatDrawerListItem } from './components'

type DateFormatDrawerProps = {
  onOptionSelected: VoidFunction
}

const Component = ({ onOptionSelected }: DateFormatDrawerProps) => {
  const { locale, setDateFormat } = useUserPreferences()
  const selectOptions = getDateFormatSelectOptions(locale)

  const onClick = (value: DateFormat) => {
    setDateFormat(value)
    onOptionSelected()
  }

  return (
    <List sx={{ pt: 0 }}>
      {selectOptions.map((option) => (
        <DateFormatDrawerListItem
          key={option.value}
          value={option.value}
          label={toDisplayDate(new Date(), locale, { formatTo: option.value })}
          onClick={() => onClick(option.value)}
        />
      ))}
    </List>
  )
}

export default Component
