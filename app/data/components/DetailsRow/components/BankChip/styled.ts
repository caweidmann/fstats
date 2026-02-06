import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme) => {
  return {
    chip: (hasError: boolean) => {
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.3,
        borderRadius: 1,
        border: hasError ? 'none' : `1px solid ${theme.vars.palette.divider}`,
      }
    },

    label: {
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    },
  }
}
