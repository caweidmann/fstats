'use client'

import { Clear } from '@mui/icons-material'
import { Box, IconButton, ListSubheader } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { ColorMode } from '@/types-enums'
import { MISC } from '@/common'
import { useIsMobile } from '@/hooks'

import { PULLER_WRAPPER_HEIGHT } from '../SwipeableDrawer/styled'

type SwipeableDrawerSubheaderProps = {
  title: ReactNode
  onClose: VoidFunction
}

const Component = ({ title, onClose }: SwipeableDrawerSubheaderProps) => {
  const isMobile = useIsMobile()
  const theme = useTheme()

  return (
    <ListSubheader
      sx={{
        top: isMobile ? PULLER_WRAPPER_HEIGHT : 0,
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
        zIndex: 1,
        background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
        },
        backdropFilter: 'blur(10px)',
        mb: 1,
      }}
    >
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
