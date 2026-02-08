'use client'

import { Container } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { LAYOUT } from '@/common'

import SwipeableDrawer from '../SwipeableDrawer'
import { Footer, Header, MenuDrawer } from './components'

type LayoutProps = {
  children: ReactNode
}

const Component = ({ children }: LayoutProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Header onMenuClick={() => setOpen(!open)} />

      <Container maxWidth={LAYOUT.CONTAINER_MAX_WIDTH}>{children}</Container>

      <Footer />

      <SwipeableDrawer anchor="left" open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} mainMenu>
        <MenuDrawer onClose={() => setOpen(false)} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
