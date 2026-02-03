'use client'

import { Translate } from '@mui/icons-material'
import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { UserLocale } from '@/types-enums'
import { LanguageDrawer, SwipeableDrawer } from '@/components'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

type LanguageSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: LanguageSwitcherProps) => {
  const isMobile = useIsMobile()
  const { t, i18n } = useTranslation()
  const [languageDrawer, setLanguageDrawer] = useState(false)
  const selectedLocale = i18n.language === UserLocale.DE ? UserLocale.DE.toUpperCase() : UserLocale.EN.toUpperCase()
  const activeLabel = t(`COMPONENTS.LANGUAGE_SWITCHER.LOCALE_${selectedLocale}_LANGUAGE_${selectedLocale}`)

  const onOpen = () => {
    setLanguageDrawer(true)
  }

  const onClose = () => {
    setLanguageDrawer(false)
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

      <SwipeableDrawer anchor="bottom" open={languageDrawer} onClose={onClose} onOpen={onOpen}>
        <LanguageDrawer onOptionSelected={onClose} onClose={onClose} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
