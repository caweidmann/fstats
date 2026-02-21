import { deepOrange, grey, yellow } from '@mui/material/colors'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import type { CategoryColorConfig } from '@/utils/Category'

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

    categoryChip: (color?: CategoryColorConfig) => ({
      borderRadius: 1.5,
      fontWeight: 500,
      fontSize: isMobile ? '0.6rem' : '0.7rem',
      height: isMobile ? 18 : 22,
      ...(color
        ? {
            backgroundColor: alpha(color.light[1], 0.18),
            color: color.light[0],
            [theme.getColorSchemeSelector(ColorMode.DARK)]: {
              backgroundColor: alpha(color.dark[1], 0.18),
              color: color.dark[1],
            },
          }
        : {
            backgroundColor: alpha(grey[500], 0.18),
            color: grey[700],
            [theme.getColorSchemeSelector(ColorMode.DARK)]: {
              backgroundColor: alpha(grey[500], 0.18),
              color: grey[400],
            },
          }),
    }),

    highlight: {
      backgroundColor: yellow.A200,
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        backgroundColor: deepOrange.A200,
      },
      borderRadius: 0.25,
    },
  }
}
