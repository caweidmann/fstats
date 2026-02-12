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

    taxCard: {
      p: 2.5,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%',
    },

    progressBar: {
      height: 8,
      borderRadius: 4,
      '& .MuiLinearProgress-bar': {
        borderRadius: 4,
      },
    },
  }
}
