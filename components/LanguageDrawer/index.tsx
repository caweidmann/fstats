'use client'

import { Box, List } from '@mui/material'

import { UserLocale } from '@/types-enums'
import SwipeableDrawerSubheader from '../SwipeableDrawerSubheader'
import { useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { LanguageDrawerListItem } from './components'

type LanguageDrawerProps = {
  onOptionSelected: VoidFunction
  onClose: VoidFunction
}

export const getLanguageSelectOptions = () => {
  return [{ value: UserLocale.EN }, { value: UserLocale.DE }]
}

const Component = ({ onOptionSelected, onClose }: LanguageDrawerProps) => {
  const { t, i18n } = useTranslation()
  const { setLocale } = useUserPreferences()
  const selectOptions = getLanguageSelectOptions()

  const onClick = (locale: UserLocale) => {
    i18n.changeLanguage(locale)
    setLocale(locale)
    onOptionSelected()
  }

  return (
    <Box>
      <List
        subheader={
          <SwipeableDrawerSubheader title={t('COMPONENTS.LANGUAGE_SWITCHER.CHANGE_LANGUAGE')} onClose={onClose} />
        }
      >
        {selectOptions.map((option) => (
          <LanguageDrawerListItem key={option.value} locale={option.value} onClick={() => onClick(option.value)} />
        ))}
      </List>
    </Box>
  )
}

export default Component
