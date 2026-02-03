import { blue, blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { trispace } from '@/styles/fonts'
import { sxBlueBorderBefore } from '@/styles/styled'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    heroText: {
      mt: isMobile ? 3 : 2.5,
      mb: isMobile ? 2.5 : 3,
      fontSize: isMobile ? 38 : 62,
      lineHeight: isMobile ? 1.3 : 1.3,
      fontWeight: 900,
      color: 'secondary.light',
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        color: blue[500],
      },
    },

    heroSubtext: {
      mb: isMobile ? 3 : 3.5,
      fontSize: isMobile ? 20 : 24,
    },

    heroHighlight: {
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      textWrap: 'inherit',
      background: 'linear-gradient(to right, var(--mui-palette-info-main), var(--mui-palette-info-light))',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        background: 'linear-gradient(to right, var(--mui-palette-success-dark), var(--mui-palette-success-main))',
        backgroundClip: 'text',
      },
    },

    linksWrapper: {
      mt: isMobile ? 6 : 5,
      display: 'flex',
      gap: isMobile ? 1.5 : 3,
    },

    cta: {
      px: isMobile ? 2.5 : 4,
      py: isMobile ? 1.25 : 2.25,
      borderRadius: isMobile ? 100 : 4,
      gap: 1,
      fontWeight: 600,
      fontSize: isMobile ? 16 : 19,
      borderWidth: 2,
      textTransform: 'none',
    },

    link: {
      px: 2,
      py: 1,
      borderRadius: 100,
      gap: 0.5,
    },

    linkIcon: {
      fontSize: 16,
    },

    linkText: {
      fontSize: isMobile ? 13 : 14,
    },

    chipWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: isMobile ? 1 : 1.5,
      mb: isMobile ? 0 : 0.5,
    },

    chip: {
      cursor: 'default',
      backgroundColor: theme.vars.palette.action.hover,
      fontSize: isMobile ? 15 : 16,
      height: isMobile ? 32 : 36,
      px: isMobile ? 0.25 : 0.5,
      borderRadius: 100,
    },

    openToRemote: {
      mb: 0,
      fontSize: isMobile ? 13 : 14,
      color: blueGrey[700],
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        color: blueGrey[300],
      },
    },

    pulsingDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: '#4ade80',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.5,
        },
      },
    },

    sectionTitle: {
      mb: isMobile ? 3 : 4,
      fontSize: isMobile ? 22 : 24,
      fontWeight: 700,
      color: 'primary.main',
      position: 'relative',
      pl: isMobile ? 2 : 2.5,
      '&::before': {
        ...sxBlueBorderBefore(theme),
      },
    },
  }
}
