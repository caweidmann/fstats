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
      borderRadius: 2,
      backgroundColor: bgColor,
      height: '100%',
    }),

    profitCardLeft: {
      flex: '1 1 50%',
      p: 2,
    },

    profitCardDivider: {
      mx: 2,
      width: '1px',
      alignSelf: 'center',
      height: '50%',
      backgroundColor: theme.vars.palette.divider,
    },

    profitCardRight: {
      flex: '1 1 50%',
      p: 2,
    },
  }
}
