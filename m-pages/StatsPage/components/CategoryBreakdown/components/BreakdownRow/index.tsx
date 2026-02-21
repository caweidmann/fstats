import { Grid, LinearProgress, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { CategoryWithTransactions, NumberString, ParentCategoryWithTransactions } from '@/types'
import { Currency } from '@/types-enums'
import { CATEGORY_COLORS, PARENT_CATEGORY_COLORS } from '@/common'
import { useUserPreferences } from '@/hooks'
import { getMaxDecimalsForCurrency } from '@/utils/Currency'
import { toFixedLocale } from '@/utils/Number'
import { Big } from '@/lib/w-big'

import { COL_SPACING, COL1, COL2, COL3, COL4 } from '../../actions'
import { ui } from './styled'

type BreakdownRowProps = {
  category: ParentCategoryWithTransactions | CategoryWithTransactions
  parentCategoryTotal: NumberString
  currency: Currency
}

const Component = ({ category, parentCategoryTotal, currency }: BreakdownRowProps) => {
  const theme = useTheme()
  const sx = ui(theme)
  const { locale } = useUserPreferences()
  const total = Big(category.total).abs()
  const percentage = total.div(total.eq(0) ? 1 : parentCategoryTotal).times(100)
  const totalDisplay = toFixedLocale(total.toString(), getMaxDecimalsForCurrency(currency), locale)
  const percentageDisplay = toFixedLocale(percentage.toString(), 1, locale)
  const color = category.hasOwnProperty('subcategories')
    ? PARENT_CATEGORY_COLORS[category.code]
    : CATEGORY_COLORS[category.code]

  return (
    <Grid container spacing={COL_SPACING} sx={{ mt: 1 }}>
      <Grid size={{ xs: COL1[0], sm: COL1[1] }}>
        <Typography variant="body2" noWrap sx={sx.text(total.gt(0))}>
          {category.label}
        </Typography>
      </Grid>
      <Grid size={{ xs: COL2[0], sm: COL2[1] }}>
        <Typography variant="body2" align="right" sx={sx.text(total.gt(0))}>
          {totalDisplay}
        </Typography>
      </Grid>
      <Grid size={{ xs: COL3[0], sm: COL3[1] }}>
        <Typography variant="body2" align="right" sx={sx.text(total.gt(0))}>
          {percentageDisplay}%
        </Typography>
      </Grid>
      <Grid size={{ xs: COL4[0], sm: COL4[1] }}>
        <LinearProgress variant="determinate" value={percentage.toNumber()} sx={sx.progress(total.gt(0), color)} />
      </Grid>
    </Grid>
  )
}

export default Component
