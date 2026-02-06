import { DoneOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

import type { SelectOptionWithType } from '@/types'

type SelectMenuItemProps<T> = {
  option: SelectOptionWithType<T>
  isSelected: boolean
  maskData?: boolean
}

const Component = <T,>({ option, isSelected, maskData = false }: SelectMenuItemProps<T>) => {
  const icon = isSelected ? <DoneOutlined fontSize="small" color="secondary" sx={{ ml: 2 }} /> : null

  if (option.labelSecondary) {
    return (
      <>
        <Box sx={{ pr: isSelected ? 0 : 1 }}>
          <Typography variant="body2" sx={{ fontWeight: isSelected ? 'bold' : 'normal', mb: 0 }}>
            {maskData ? <span data-notrack>{option.label}</span> : option.label}
          </Typography>
          <Typography color="secondary" sx={{ fontSize: 11, mb: 0 }}>
            {maskData ? <span data-notrack>{option.labelSecondary}</span> : option.labelSecondary}
          </Typography>
        </Box>
        {icon}
      </>
    )
  }

  return (
    <>
      <Typography sx={{ fontWeight: isSelected ? 'bold' : 'normal', pr: isSelected ? 0 : 2 }}>
        {maskData ? <span data-notrack>{option.label}</span> : option.label}
      </Typography>
      {icon}
    </>
  )
}

export default Component
