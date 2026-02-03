import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    card: {
      height: '100%',
      p: isMobile ? 3 : 3.5,
      borderRadius: 4,
      background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.08) 0%, rgba(76, 175, 80, 0.08) 100%)',
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
      },
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      border: `3px solid transparent`,
      transition: 'border-color 0.2s ease-in-out',
      '&:hover': {
        borderColor: theme.vars.palette.info.main,
      },
    },

    title: {
      fontSize: isMobile ? 18 : 20,
      fontWeight: 700,
      mb: 1.5,
    },

    description: {
      fontSize: isMobile ? 14 : 16,
      color: 'text.secondary',
      mb: 3,
    },
  }
}
