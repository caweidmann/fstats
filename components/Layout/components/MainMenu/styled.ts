import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { LAYOUT, MISC } from '@/common'

export const ui = (theme: Theme, isDarkMode: boolean, isMobile: boolean) => {
  return {
    menuContainer: (isSticky: boolean) => {
      const marginX = isMobile ? theme.spacing(1) : isMobile ? theme.spacing(0) : 'auto'

      return {
        zIndex: LAYOUT.NAV_Z_INDEX,
        position: 'sticky',
        top: theme.spacing(1),
        width: isMobile && isSticky ? `calc(100% - (2 * ${marginX}))` : '100%',
        background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
        },
        backdropFilter: 'blur(10px)',
        transition: 'box-shadow 0.5s, border-color 0.5s, border-radius 0.5s, width 0.5s, margin 0.5s',
        boxShadow: isSticky
          ? isDarkMode
            ? '0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 6px 20px -4px rgba(0, 0, 0, 0.25), 0 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 6px 20px -4px rgba(0, 0, 0, 0.12), 0 0 1px 0 rgba(0, 0, 0, 0.05)'
          : 'none',
        borderRadius: 100,
        borderTop: `1px solid ${isDarkMode && isSticky ? theme.vars.palette.divider : 'transparent'}`,
      }
    },

    menuWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
    },

    menu: (isSticky: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0.5 : isSticky ? 2 : 1,
    }),

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

    divider: (isSticky: boolean) => {
      return {
        opacity: isSticky ? 0 : 1,
        transition: 'opacity 0.5s',
      }
    },
  }
}
