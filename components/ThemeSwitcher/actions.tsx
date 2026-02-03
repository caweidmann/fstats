import { Brightness4Outlined, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { useColorScheme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { i18n } from '@/lib/i18n'

export const getActiveIcon = (mode: ReturnType<typeof useColorScheme>['mode'], color: 'primary' | 'secondary') => {
  switch (mode) {
    case ColorMode.LIGHT:
      return <LightModeOutlined color={color} sx={{ fontSize: 18 }} />
    case ColorMode.DARK:
      return <DarkModeOutlined color={color} sx={{ fontSize: 18 }} />
    case ColorMode.SYSTEM:
    default:
      return <Brightness4Outlined color={color} sx={{ fontSize: 18 }} />
  }
}

export const getActiveLabel = (imode: ReturnType<typeof useColorScheme>['mode']) => {
  switch (imode) {
    case ColorMode.LIGHT:
      return i18n.t('COMPONENTS.THEME_SWITCHER.THEME_LIGHT')
    case ColorMode.DARK:
      return i18n.t('COMPONENTS.THEME_SWITCHER.THEME_DARK')
    case ColorMode.SYSTEM:
    default:
      return i18n.t('COMPONENTS.THEME_SWITCHER.THEME_SYSTEM')
  }
}
