'use client'

import { Box, List } from '@mui/material'
import { usePathname } from 'next/navigation'

import { ROUTES } from '@/common'
import SwipeableDrawerSubheader from '../../../SwipeableDrawerSubheader'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import MenuDrawerNavButton from '../MenuDrawerNavButton'

type MenuDrawerProps = {
  onClose: VoidFunction
}

const Component = ({ onClose }: MenuDrawerProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  return (
    <List
      subheader={
        <Box sx={{ mt: isMobile ? 1 : 2, p: 2 }}>
          <SwipeableDrawerSubheader title={t('DATA_DISPLAY.MENU')} onClose={onClose} />
        </Box>
      }
      disablePadding
    >
      <Box sx={{ mt: 3 }}>
        <MenuDrawerNavButton route={ROUTES.HOME} isActive={pathname === ROUTES.HOME} onClose={onClose}>
          {t('NAVIGATION.HOME')}
        </MenuDrawerNavButton>
        <MenuDrawerNavButton route={ROUTES.DATA} isActive={pathname === ROUTES.DATA} onClose={onClose}>
          {t('NAVIGATION.DATA')}
        </MenuDrawerNavButton>
        <MenuDrawerNavButton route={ROUTES.STATS} isActive={pathname === ROUTES.STATS} onClose={onClose}>
          {t('NAVIGATION.STATS')}
        </MenuDrawerNavButton>
        <MenuDrawerNavButton route={ROUTES.SETTINGS} isActive={pathname === ROUTES.SETTINGS} onClose={onClose}>
          {t('NAVIGATION.SETTINGS')}
        </MenuDrawerNavButton>
      </Box>
    </List>
  )
}

export default Component
