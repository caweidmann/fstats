import { Grid, LinearProgress, Typography } from '@mui/material'
import { green } from '@mui/material/colors'
import { linearProgressClasses } from '@mui/material/LinearProgress'

import type { Category, NumberBig } from '@/types'
import { ColorMode } from '@/types-enums'
import { MISC } from '@/common'
import { useUserPreferences } from '@/hooks'
import { toFixedLocale } from '@/utils/Number'

import { COL_SPACING, COL1, COL2, COL3, COL4 } from '../../actions'

type BreakdownRowProps = {
  category: Category
  total: NumberBig
}

const Component = ({ category, total }: BreakdownRowProps) => {
  const { locale } = useUserPreferences()
  const percentage = total
    .div(total.eq(0) ? 1 : total)
    .times(100)
    .toNumber()

  return (
    <Grid container spacing={COL_SPACING} sx={{ mt: 1 }}>
      <Grid size={{ xs: COL1[0], sm: COL1[1] }}>
        <Typography variant="body2" noWrap sx={{ mb: 0, fontSize: 15, opacity: total.gt(0) ? 1 : 0.5 }} data-notrack>
          {category.label}
        </Typography>
      </Grid>
      <Grid size={{ xs: COL2[0], sm: COL2[1] }}>
        <Typography
          variant="body2"
          align="right"
          sx={{ mb: 0, fontSize: 15, opacity: total.gt(0) ? 1 : 0.5 }}
          data-notrack
        >
          {total.toString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: COL3[0], sm: COL3[1] }}>
        <Typography
          variant="body2"
          align="right"
          sx={{ mb: 0, fontSize: 15, opacity: total.gt(0) ? 1 : 0.5 }}
          data-notrack
        >
          <small>{toFixedLocale(percentage.toString(), 1, locale)}%</small>
        </Typography>
      </Grid>
      <Grid size={{ xs: COL4[0], sm: COL4[1] }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            opacity: total.gt(0) ? 1 : 0.3,
            position: 'relative',
            top: '8px',
            height: '10px',
            borderRadius: 100,
            [`&.${linearProgressClasses.colorPrimary}`]: (theme) => ({
              background: theme.vars.palette.grey[200],
              [theme.getColorSchemeSelector(ColorMode.DARK)]: {
                background: theme.vars.palette.background.default,
              },
            }),
            [`& .${linearProgressClasses.bar}`]: (theme) => ({
              borderRadius: 100,
              background: `linear-gradient(90deg, ${green[700]} 0%, ${green[300]} 100%)`,
              [theme.getColorSchemeSelector(ColorMode.DARK)]: {
                background: `linear-gradient(90deg, ${green[900]} 0%, ${green[400]} 100%)`,
              },
            }),
          }}
          className={MISC.NO_CAPTURE_CLASS}
        />
      </Grid>
    </Grid>
  )
}

export default Component
