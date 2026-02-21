import { linearProgressClasses } from '@mui/material/LinearProgress'
import type { Theme } from '@mui/material/styles'

import { GradientColorsLightDark } from '@/types'
import { ColorMode } from '@/types-enums'

export const ui = (theme: Theme) => {
  return {
    button: (expanded: boolean) => ({
      py: 0.5,
      px: 1,
      mt: 1,
      borderRadius: expanded ? 2 : 1.5,
      width: '100%',
      display: 'block',
      textAlign: 'initial',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),

    text: (disabled: boolean) => ({
      mb: 0,
      fontSize: 15,
      opacity: disabled ? 1 : 0.5,
    }),

    progress: (disabled: boolean, color: GradientColorsLightDark) => ({
      opacity: disabled ? 1 : 0.3,
      height: 10,
      borderRadius: 100,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        background: theme.vars.palette.grey[200],
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: theme.vars.palette.background.default,
        },
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 100,
        background: `linear-gradient(90deg, ${color.light.start} 0%, ${color.light.end} 100%)`,
        [theme.getColorSchemeSelector(ColorMode.DARK)]: {
          background: `linear-gradient(90deg, ${color.dark.start} 0%, ${color.dark.end} 100%)`,
        },
      },
    }),
  }
}
