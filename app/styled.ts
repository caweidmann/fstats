import { blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { trispace } from '@/styles/fonts'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    button: {
      borderRadius: 1.5,
    },

    uploadIcon: {
      fontSize: 48,
      mb: 1,
      opacity: 0.7,
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
      transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
        borderColor: theme.vars.palette.primary.light,
      },
    }),

    fileCard: (status: 'uploading' | 'complete' | 'error') => ({
      border: `1px solid ${
        status === 'complete'
          ? theme.vars.palette.success.main
          : status === 'error'
            ? theme.vars.palette.error.main
            : isDarkMode
              ? blueGrey[700]
              : grey[300]
      }`,
      borderRadius: 2,
      padding: theme.spacing(2),
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
      transition: 'all 0.3s ease-in-out',
    }),

    fileIcon: {
      color: 'primary.main',
      fontSize: 32,
    },

    fileContentBox: {
      flexGrow: 1,
      minWidth: 0,
    },

    fileName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    progressContainer: {
      mt: 1,
    },

    progressBar: (status: 'uploading' | 'complete' | 'error') => ({
      height: 6,
      borderRadius: 3,
      backgroundColor: 'action.hover',
      '& .MuiLinearProgress-bar': {
        borderRadius: 3,
        backgroundColor: status === 'complete' ? 'success.main' : status === 'error' ? 'error.main' : 'primary.main',
      },
    }),

    statusContainer: {
      mt: 0.5,
    },

    deleteButton: {
      ml: 1,
    },
  }
}
