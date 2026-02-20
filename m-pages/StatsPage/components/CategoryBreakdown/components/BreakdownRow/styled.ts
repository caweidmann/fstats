import { red } from '@mui/material/colors'
import { linearProgressClasses } from '@mui/material/LinearProgress'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'

export const ui = (theme: Theme) => {
  return {
    text: (disabled: boolean) => ({
      mb: 0,
      fontSize: 15,
      opacity: disabled ? 1 : 0.5,
    }),

    progress: (disabled: boolean) => ({
      opacity: disabled ? 1 : 0.3,
      position: 'relative',
      top: '8px',
      height: '10px',
      borderRadius: 100,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        background: theme.vars.palette.grey[200],
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: theme.vars.palette.background.default,
        },
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 100,
        background: `linear-gradient(90deg, ${red[700]} 0%, ${red[300]} 100%)`,
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: `linear-gradient(90deg, ${red[900]} 0%, ${red[400]} 100%)`,
        },
      },
    }),
  }
}
