'use client'

import { Box, SwipeableDrawer } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks'

import { Puller, PullerWrapper, ui } from './styled'

type SwipeableDrawerProps = {
  anchor: 'left' | 'bottom'
  open: boolean
  onClose: VoidFunction
  onOpen: VoidFunction
  mainMenu?: boolean
  children: ReactNode
  drawerSx?: SxProps<Theme>
  paperSx?: SxProps<Theme>
}

const Component = ({
  anchor = 'bottom',
  open,
  onClose,
  onOpen,
  mainMenu = false,
  children,
  drawerSx = {},
  paperSx = {},
}: SwipeableDrawerProps) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(anchor, theme, isMobile)
  const isBottomDrawer = anchor === 'bottom'

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      elevation={0}
      disableSwipeToOpen
      slotProps={{
        paper: { sx: { ...sx.drawer(mainMenu), ...paperSx } },
        backdrop: { sx: sx.backdrop },
      }}
      sx={{
        zIndex: mainMenu ? theme.zIndex.drawer + 1 : theme.zIndex.drawer + 1,
        ...drawerSx,
      }}
    >
      <Box role="presentation">
        {isMobile && isBottomDrawer ? (
          <PullerWrapper>
            <Puller />
          </PullerWrapper>
        ) : null}
        {children}
      </Box>
    </SwipeableDrawer>
  )
}

export default Component
