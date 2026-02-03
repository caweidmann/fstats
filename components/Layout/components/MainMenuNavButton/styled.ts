import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme, isSticky: boolean) => {
  return {
    button: (isActive: boolean) => ({
      minWidth: 0,
      px: isSticky ? 1 : 1.5,
      py: isSticky ? 0.75 : 1,
      transition: 'padding 0.5s',
      borderRadius: 1.5,
      backgroundColor: isActive ? theme.vars.palette.action.hover : 'transparent',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),

    text: (isActive: boolean) => ({
      fontSize: 14,
      lineHeight: 1.2,
      fontWeight: isActive ? 'bold' : 'normal',
    }),
  }
}
