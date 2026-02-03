'use client'

import { Clear } from '@mui/icons-material'
import { Box, IconButton, ListSubheader } from '@mui/material'
import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks'

import { PULLER_WRAPPER_HEIGHT } from '../SwipeableDrawer/styled'

type SwipeableDrawerSubheaderProps = {
  title: ReactNode
  onClose: VoidFunction
}

const Component = ({ title, onClose }: SwipeableDrawerSubheaderProps) => {
  const isMobile = useIsMobile()

  return (
    <ListSubheader sx={{ top: isMobile ? PULLER_WRAPPER_HEIGHT : 0, background: 'transparent' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1 }}>{title}</Box>
        <Box>
          <IconButton edge="end" color="primary" onClick={onClose} sx={{ color: 'inherit' }}>
            <Clear fontSize="medium" />
          </IconButton>
        </Box>
      </Box>
    </ListSubheader>
  )
}
export default Component
