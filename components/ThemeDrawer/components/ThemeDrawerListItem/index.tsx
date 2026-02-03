'use client'

import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { useTranslation } from '@/lib/i18n'

import RadioButton from '../../../RadioButton'

type ThemeDrawerListItemProps = {
  mode: ColorMode
  onClick: (mode: ColorMode) => void
}

const Component = ({ mode, onClick }: ThemeDrawerListItemProps) => {
  const { t } = useTranslation()
  const { mode: activeMode } = useColorScheme()

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onClick(mode)}>
        <ListItemIcon>
          <RadioButton checked={activeMode === mode} />
        </ListItemIcon>
        <ListItemText primary={t(`COMPONENTS.THEME_SWITCHER.THEME_${mode.toUpperCase()}`)} />
      </ListItemButton>
    </ListItem>
  )
}

export default Component
