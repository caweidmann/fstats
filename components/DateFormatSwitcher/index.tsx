'use client'

import { DateRangeOutlined } from '@mui/icons-material'
import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'

import { useIsMobile, useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'

import DateFormatDrawer from '../DateFormatDrawer'
import SwipeableDrawer from '../SwipeableDrawer'

type DateFormatSwitcherProps = {
  showLabel?: boolean
}

const Component = ({ showLabel = false }: DateFormatSwitcherProps) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { locale, dateFormat } = useUserPreferences()

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip title={t('COMPONENTS.DATE_FORMAT_SWITCHER.CHANGE_DATE_FORMAT')}>
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
            startIcon={<DateRangeOutlined color="secondary" sx={{ fontSize: 18 }} />}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1.2 }}>
              {toDisplayDate(new Date(), locale, { formatTo: dateFormat })}
            </Typography>
          </Button>
        ) : (
          <IconButton size={isMobile ? 'large' : 'medium'} color="secondary" onClick={onOpen}>
            <DateRangeOutlined color="secondary" sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Tooltip>

      <SwipeableDrawer
        title={t('COMPONENTS.DATE_FORMAT_SWITCHER.CHANGE_DATE_FORMAT')}
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        fixedHeader
      >
        <DateFormatDrawer onOptionSelected={onClose} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
