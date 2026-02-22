import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme) => {
  return {
    statCard: (bgColor: string, showBorder = true) => ({
      p: 2,
      borderRadius: 2,
      backgroundColor: bgColor,
      height: '100%',
      border: `1px solid ${showBorder ? theme.vars.palette.divider : 'transparent'}`,
    }),

    statHeader: {
      display: 'flex',
      alignItems: 'center',
    },

    profitCard: (bgColor: string) => ({
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      borderRadius: 2,
      backgroundColor: bgColor,
      height: '100%',
    }),

    profitCardLeft: {
      flex: '1 1 50%',
      p: 2,
    },

    profitCardDivider: {
      mx: { xs: 2, sm: 2 },
      my: { xs: 1.5, sm: 0 },
      width: { xs: 'calc(100% - 32px)', sm: '1px' },
      alignSelf: 'center',
      height: { xs: '1px', sm: '50%' },
      backgroundColor: theme.vars.palette.divider,
    },

    profitCardRight: {
      flex: '1 1 50%',
      p: 2,
    },
  }
}
