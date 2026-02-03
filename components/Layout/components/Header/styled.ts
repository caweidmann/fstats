import type { Theme } from '@mui/material/styles'

import { LAYOUT } from '@/common'
import { trispace } from '@/styles/fonts'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    wrapper: {
      position: 'relative',
      zIndex: LAYOUT.NAV_Z_INDEX,
    },

    profileWrapper: {
      pt: 4,
      pb: isMobile ? 2 : 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      flexDirection: isMobile ? 'column' : 'row',
    },

    imageWrapper: {
      display: 'flex',
      justifyContent: 'center',
      mr: isMobile ? 0 : 5,
      mb: isMobile ? 4 : 0,
    },

    image: {
      borderRadius: 100,
      backgroundColor: theme.vars.palette.divider,
    },

    textWrapper: {
      textAlign: isMobile ? 'center' : 'left',
      position: 'relative',
    },

    name: {
      fontFamily: trispace.style.fontFamily,
      fontSize: isMobile ? 28 : 30,
      fontWeight: 'bold',
    },

    bio: {
      mb: 0,
      fontSize: isMobile ? 12 : 13,
      fontFamily: trispace.style.fontFamily,
    },

    bioExtra: {
      fontFamily: trispace.style.fontFamily,
      mb: 0,
      fontSize: isMobile ? 15 : 16,
    },
  }
}
