import { blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { trispace } from '@/styles/fonts'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    dropZone: {
      border: `1px dashed ${isDarkMode ? blueGrey[700] : grey[300]}`,
      borderRadius: 2,
      padding: isMobile ? theme.spacing(4) : theme.spacing(6),
      textAlign: 'center' as const,
      color: isDarkMode ? grey[300] : grey[800],
      fontFamily: trispace.style.fontFamily,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    },
  }
}
