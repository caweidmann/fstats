import type { Theme } from '@mui/material/styles'

import { LAYOUT } from '@/common'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: isMobile ? LAYOUT.FOOTER_HEIGHT_MOBILE : LAYOUT.FOOTER_HEIGHT,
    },

    divider: {
      borderWidthBottom: LAYOUT.FOOTER_BORDER,
    },
  }
}
