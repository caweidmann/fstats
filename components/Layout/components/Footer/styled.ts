import type { Theme } from '@mui/material/styles'

import { LAYOUT } from '@/common'

export const ui = (theme: Theme) => {
  return {
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: LAYOUT.FOOTER_HEIGHT,
    },

    divider: {
      borderWidthBottom: LAYOUT.FOOTER_BORDER,
    },
  }
}
