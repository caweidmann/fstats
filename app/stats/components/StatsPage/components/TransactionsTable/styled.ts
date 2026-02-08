import { deepOrange, yellow } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    searchContainer: {
      mt: 1,
      mb: 3,
    },

    searchField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
    },

    tableHeader: {
      fontWeight: 600,
      fontSize: isMobile ? '0.75rem' : '0.8125rem',
      color: 'text.secondary',
      py: isMobile ? 1 : 1.5,
      px: isMobile ? 1 : 2,
    },

    tableRow: {
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    },

    compactCell: {
      py: isMobile ? 0.75 : 1,
      px: isMobile ? 1 : 2,
    },

    descriptionCell: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
    },

    categoryChip: {
      borderRadius: 1.5,
      fontWeight: 500,
      fontSize: isMobile ? '0.6rem' : '0.7rem',
      height: isMobile ? 18 : 22,
    },

    highlight: {
      backgroundColor: yellow.A200,
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        backgroundColor: deepOrange.A200,
      },
      // (theme: Theme) => (theme.vars.palette.mode === 'dark' ? '#fff' : yellow.A200),
      // color: (theme: Theme) => (theme.vars.palette.mode === 'dark' ? '#000' : 'inherit'),
      borderRadius: 0.25,
    },
  }
}
