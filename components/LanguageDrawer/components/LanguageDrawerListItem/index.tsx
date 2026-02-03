'use client'

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

import { UserLocale } from '@/types-enums'
import { useTranslation } from '@/lib/i18n'

import RadioButton from '../../../RadioButton'

interface ThemeDrawerListItemProps {
  locale: UserLocale
  onClick: (locale: UserLocale) => void
}

const Component = ({ locale, onClick }: ThemeDrawerListItemProps) => {
  const { t, i18n } = useTranslation()

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onClick(locale)}>
        <ListItemIcon>
          <RadioButton checked={i18n.language === locale} />
        </ListItemIcon>
        <ListItemText
          primary={t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${locale.toUpperCase()}_LANGUAGE_${locale.toUpperCase()}`)}
          secondary={
            i18n.language !== locale
              ? t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${locale.toUpperCase()}_LANGUAGE_${i18n.language.toUpperCase()}`)
              : ''
          }
          slotProps={{
            secondary: {
              variant: 'body1',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default Component
