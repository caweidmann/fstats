import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { MISC } from '@/common'

export const sxHideScrollbar = {
  overflow: 'auto',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE 10+
  '&::-webkit-scrollbar': {
    display: 'none', // WebKit (Chrome, Safari, Edge)
  },
} as const

export const PULLER_WRAPPER_HEIGHT = 24

export const PullerWrapper = styled('div')(({ theme }) => {
  return {
    width: '100%',
    height: PULLER_WRAPPER_HEIGHT,
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 10,
    background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
    [theme.getColorSchemeSelector(ColorMode.DARK)]: {
      background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
    },
    backdropFilter: 'blur(10px)',
  }
})

export const Puller = styled('div')(({ theme }) => ({
  width: '30px',
  height: '4px',
  backgroundColor: grey[400],
  borderRadius: '2px',
  position: 'relative',
  top: '8px',
  left: 'calc(50% - 15px)',
  [theme.getColorSchemeSelector(ColorMode.DARK)]: {
    backgroundColor: theme.vars.palette.secondary.dark,
  },
}))

export const ui = (anchor: 'left' | 'bottom', theme: Theme, isMobile = false) => {
  const isBottomDrawer = anchor === 'bottom'

  return {
    backdrop: {
      backgroundColor: 'hsl(0deg 0% 0% / 0.1) !important',
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        backgroundColor: 'hsl(0deg 0% 0% / 0.6) !important',
      },
    },

    drawer: (mainMenu = false) => {
      const paddingX = isMobile ? theme.spacing(1.5) : theme.spacing(2)
      const paddingY = isMobile ? theme.spacing(1.5) : theme.spacing(2)
      const padding = `${paddingY} ${paddingX}`
      const maxHeight = isMobile ? '370px' : '60%'

      return {
        ...sxHideScrollbar,
        background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
        },
        backdropFilter: 'blur(10px)',
        m: padding,
        width: mainMenu ? 300 : `calc(100% - (2 * ${paddingX}))`,
        maxWidth: mainMenu ? '70%' : '100%',
        maxHeight: isBottomDrawer ? maxHeight : `calc(100% - (2 * ${paddingY}))`,
        borderRadius: theme.spacing(mainMenu ? 4 : 2),
        zIndex: theme.zIndex.drawer + 1,
      }
    },
  }
}
