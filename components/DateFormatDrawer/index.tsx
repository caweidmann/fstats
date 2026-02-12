'use client'

import { Box, List } from '@mui/material'

import { DateFormat } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { getDateFormatSelectOptions, toDisplayDate } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'

import SwipeableDrawerSubheader from '../SwipeableDrawerSubheader'
import { DateFormatDrawerListItem } from './components'

type DateFormatDrawerProps = {
  onOptionSelected: VoidFunction
  onClose: VoidFunction
}

const Component = ({ onOptionSelected, onClose }: DateFormatDrawerProps) => {
  const { locale, setDateFormat } = useUserPreferences()
  const { t } = useTranslation()
  const selectOptions = getDateFormatSelectOptions(locale)

  const onClick = (value: DateFormat) => {
    setDateFormat(value)
    onOptionSelected()
  }

  return (
    <Box>
      <List
        subheader={
          <SwipeableDrawerSubheader title={t('COMPONENTS.DATE_FORMAT_SWITCHER.CHANGE_DATE_FORMAT')} onClose={onClose} />
        }
      >
        {selectOptions.map((option) => (
          <DateFormatDrawerListItem
            key={option.value}
            value={option.value}
            label={toDisplayDate(new Date(), locale, { formatTo: option.value })}
            onClick={() => onClick(option.value)}
          />
        ))}
      </List>
    </Box>
  )
}

export default Component
