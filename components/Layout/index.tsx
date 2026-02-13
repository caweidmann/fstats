'use client'

import { Container } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { LAYOUT } from '@/common'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import SwipeableDrawer from '../SwipeableDrawer'
import { Footer, Header, MenuDrawer } from './components'

type LayoutProps = {
  children: ReactNode
}

const Component = ({ children }: LayoutProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Header onMenuClick={() => setOpen(!open)} />

      <Container maxWidth={LAYOUT.CONTAINER_MAX_WIDTH}>{children}</Container>

      <Footer />

      <SwipeableDrawer
        title={t('DATA_DISPLAY.MENU')}
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        mainMenu
        headerSx={{ mt: isMobile ? 1 : 2, py: 2, px: 4 }}
      >
        <MenuDrawer onClose={onClose} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
