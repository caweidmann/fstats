'use client'

import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SwipeableDrawer, ThemeDrawer } from '@/components'
import { useIsMobile } from '@/hooks'

import { getActiveIcon, getActiveLabel } from './actions'

type ThemeSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: ThemeSwitcherProps) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { mode } = useColorScheme()
  const [themeDrawer, setThemeDrawer] = useState(false)

  const onOpen = () => {
    setThemeDrawer(true)
  }

  const onClose = () => {
    setThemeDrawer(false)
  }

  return (
    <>
      <Tooltip title={t('COMPONENTS.THEME_SWITCHER.CHOOSE_THEME')}>
        {showLabel ? (
          <Button
            size={isMobile ? 'large' : 'small'}
            color="secondary"
            onClick={onOpen}
            sx={{
              minWidth: 0,
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
            }}
            startIcon={getActiveIcon(mode, 'secondary')}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1.2 }}>{getActiveLabel(mode)}</Typography>
          </Button>
        ) : (
          <IconButton size={isMobile ? 'large' : 'medium'} color="secondary" onClick={onOpen}>
            {getActiveIcon(mode, 'secondary')}
          </IconButton>
        )}
      </Tooltip>

      <SwipeableDrawer anchor="bottom" open={themeDrawer} onClose={onClose} onOpen={onOpen}>
        <ThemeDrawer onOptionSelected={onClose} onClose={onClose} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
