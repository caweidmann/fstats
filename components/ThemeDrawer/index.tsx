'use client'

import { Box, List } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import SwipeableDrawerSubheader from '../SwipeableDrawerSubheader'
import { ThemeDrawerListItem } from './components'

type ThemeDrawerProps = {
  onOptionSelected: VoidFunction
  onClose: VoidFunction
}

export const getThemeSelectOptions = () => {
  return [{ value: ColorMode.SYSTEM }, { value: ColorMode.LIGHT }, { value: ColorMode.DARK }]
}

const Component = ({ onOptionSelected, onClose }: ThemeDrawerProps) => {
  const { t } = useTranslation()
  const { setMode } = useColorScheme()
  const selectOptions = getThemeSelectOptions()
  const { setColorMode } = useUserPreferences()

  const onClick = (mode: ColorMode) => {
    setMode(mode)
    setColorMode(mode)
    onOptionSelected()
  }

  return (
    <Box>
      <List
        subheader={<SwipeableDrawerSubheader title={t('COMPONENTS.THEME_SWITCHER.CHOOSE_THEME')} onClose={onClose} />}
      >
        {selectOptions.map((option) => (
          <ThemeDrawerListItem key={option.value} mode={option.value} onClick={() => onClick(option.value)} />
        ))}
      </List>
    </Box>
  )
}

export default Component
