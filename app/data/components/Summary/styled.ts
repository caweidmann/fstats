import { blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    summaryCard: () => {
      const backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'

      return {
        border: `1px solid ${isDarkMode ? blueGrey[700] : grey[300]}`,
        borderRadius: 2,
        padding: theme.spacing(2.5),
        backgroundColor,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',

        '&:active': {
          backgroundColor: isMobile ? theme.vars.palette.action.selected : backgroundColor,
        },
      }
    },
  }
}
