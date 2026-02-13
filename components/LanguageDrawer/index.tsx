'use client'

import { List } from '@mui/material'

import { UserLocale } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { LanguageDrawerListItem } from './components'

type LanguageDrawerProps = {
  onOptionSelected: VoidFunction
}

export const getLanguageSelectOptions = () => {
  return [{ value: UserLocale.EN }, { value: UserLocale.DE }]
}

const Component = ({ onOptionSelected }: LanguageDrawerProps) => {
  const { i18n } = useTranslation()
  const { setLocale } = useUserPreferences()
  const selectOptions = getLanguageSelectOptions()

  const onClick = (locale: UserLocale) => {
    i18n.changeLanguage(locale)
    setLocale(locale)
    onOptionSelected()
  }

  return (
    <List sx={{ pt: 0 }}>
      {selectOptions.map((option) => (
        <LanguageDrawerListItem key={option.value} locale={option.value} onClick={() => onClick(option.value)} />
      ))}
    </List>
  )
}

export default Component
