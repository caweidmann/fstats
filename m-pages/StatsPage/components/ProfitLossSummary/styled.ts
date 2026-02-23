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
      p: 2,
      borderRadius: 2,
      backgroundColor: bgColor,
      height: '100%',
    }),
  }
}
