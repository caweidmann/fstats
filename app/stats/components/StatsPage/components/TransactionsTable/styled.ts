import { deepOrange, yellow } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'

export const ui = (theme: Theme) => {
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
      fontSize: '0.8125rem',
      color: 'text.secondary',
      py: 1.5,
    },

    tableRow: {
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    },

    compactCell: {
      py: 1,
    },

    descriptionCell: {
      display: 'flex',
      alignItems: 'center',
    },

    categoryChip: {
      borderRadius: 1.5,
      fontWeight: 500,
      fontSize: '0.7rem',
      height: 22,
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
