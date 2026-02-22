import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { LAYOUT, MISC } from '@/common'

export const ui = (theme: Theme, isDarkMode: boolean, isMobile: boolean) => {
  return {
    menuContainer: {
      zIndex: LAYOUT.NAV_Z_INDEX,
      position: 'sticky',
      top: 0,
      width: '100%',
      background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
      },
      backdropFilter: 'blur(10px)',
    },

    menuWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: isMobile ? LAYOUT.NAV_HEIGHT_MOBILE : LAYOUT.NAV_HEIGHT,
    },

    menu: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0.5 : 1,
    },

    iconMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0 : 0.5,
      opacity: 0.75,
    },

    homeButton: (isActive: boolean) => ({
      width: 35,
      height: 35,
      backgroundColor: isActive ? theme.vars.palette.action.hover : 'transparent',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),

    divider: {
      position: 'sticky',
      top: (isMobile ? LAYOUT.NAV_HEIGHT_MOBILE : LAYOUT.NAV_HEIGHT) + LAYOUT.NAV_BORDER,
      borderWidthBottom: LAYOUT.NAV_BORDER,
      zIndex: LAYOUT.NAV_Z_INDEX + 1,
    },
  }
}
