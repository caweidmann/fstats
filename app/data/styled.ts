import { blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { trispace } from '@/styles/fonts'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    button: {
      borderRadius: 1.5,
    },

    addFolderButton: {
      borderRadius: 1.5,
      textTransform: 'none' as const,
    },

    uploadIcon: {
      fontSize: 48,
      mb: 1,
      opacity: 0.7,
    },

    summaryCard: () => {
      const backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'

      return {
        border: `1px solid ${isDarkMode ? blueGrey[700] : grey[300]}`,
        borderRadius: 2,
        padding: theme.spacing(2.5),
        backgroundColor,
        WebkitTapHighlightColor: 'transparent',

        '&:active': {
          backgroundColor: isMobile ? theme.vars.palette.action.selected : backgroundColor,
        },
      }
    },

    dropZone: (isDragActive: boolean) => ({
      border: `2px dashed ${isDragActive ? theme.vars.palette.primary.main : isDarkMode ? blueGrey[700] : grey[300]}`,
      borderRadius: 2,
      padding: isMobile ? theme.spacing(4) : theme.spacing(6),
      textAlign: 'center' as const,
      color: isDarkMode ? grey[300] : grey[800],
      fontFamily: trispace.style.fontFamily,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: isDragActive ? theme.vars.palette.action.selected : 'transparent',
      WebkitTapHighlightColor: 'transparent',

      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
        borderColor: theme.vars.palette.primary.light,
      },
    }),

    fileCard: (isError: boolean) => ({
      py: 0.5,
      opacity: isError ? 0.7 : 1,
      cursor: isError ? 'default' : 'pointer',
      borderRadius: 1.25,
      WebkitTapHighlightColor: 'transparent',
    }),

    fileContentBox: {
      flexGrow: 1,
      minWidth: 0,
    },

    fileName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    statusContainer: {
      mt: 0.5,
    },

    deleteButton: {
      ml: 1,
    },

    sectionHeader: {
      justifyContent: 'flex-start',
      textAlign: 'left' as const,
      textTransform: 'none' as const,
      padding: theme.spacing(1.5),
      borderRadius: 2,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isDarkMode ? blueGrey[800] : grey[200]}`,
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      },
    },
  }
}
