import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    summaryCard: () => {
      return {
        padding: theme.spacing(2.5),
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',

        '&:active': {
          backgroundColor: isMobile ? theme.vars.palette.action.selected : 'transparent',
        },
      }
    },

    insightItem: {
      borderBottom: '1px solid',
      borderColor: 'divider',
      pt: 3,
      px: 0,
      '&:last-child': {
        borderBottom: 'none',
      },
      alignItems: 'flex-start',
    },

    insightHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 0.5,
    },

    priorityChip: {
      height: 20,
      fontSize: '0.7rem',
      fontWeight: 500,
    },

    amountDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    },

    savingsBox: {
      textAlign: 'right',
      minWidth: 120,
    },

    summaryBox: {
      display: 'flex',
      alignItems: 'flex-start',
      mt: 3,
      p: 2,
      borderRadius: 2,
      backgroundColor: 'action.hover',
    },
  }
}
