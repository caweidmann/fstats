import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme) => {
  return {
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      pt: 2,
    },
  }
}
