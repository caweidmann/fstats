'use client'

import { Translate } from '@mui/icons-material'
import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { UserLocale } from '@/types-enums'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import LanguageDrawer from '../LanguageDrawer'
import SwipeableDrawer from '../SwipeableDrawer'

type LanguageSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: LanguageSwitcherProps) => {
  const isMobile = useIsMobile()
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const selectedLocale = i18n.language === UserLocale.DE ? UserLocale.DE.toUpperCase() : UserLocale.EN.toUpperCase()
  const activeLabel = t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${selectedLocale}_LANGUAGE_${selectedLocale}`)

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title={t('COMPONENTS.LANGUAGE_SWITCHER.CHANGE_LANGUAGE')}>
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
            startIcon={<Translate color="secondary" sx={{ fontSize: 18 }} />}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1.2 }}>{activeLabel}</Typography>
          </Button>
        ) : (
          <IconButton size={isMobile ? 'large' : 'medium'} color="secondary" onClick={onOpen}>
            <Translate color="secondary" sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Tooltip>

      <SwipeableDrawer
        title={t('COMPONENTS.LANGUAGE_SWITCHER.CHANGE_LANGUAGE')}
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
      >
        <LanguageDrawer onOptionSelected={onClose} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
