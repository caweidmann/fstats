'use client'

import { ErrorOutlineOutlined, HelpOutlineOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { StatsFile } from '@/types'
import { SupportedParsers } from '@/types-enums'
import { formatType } from '@/utils/Misc'

import { ui } from './styled'

type BankChipProps = {
  file: StatsFile
}

const Component = ({ file }: BankChipProps) => {
  const bankType = file.parsedType || SupportedParsers.UNKNOWN
  const isUnknown = bankType === SupportedParsers.UNKNOWN
  const theme = useTheme()
  const sx = ui(theme)

  if (file.error) {
    return (
      <Box sx={sx.chip(true)}>
        <ErrorOutlineOutlined sx={{ fontSize: 14, color: 'error.main' }} />

        <Typography variant="caption" color="error" sx={sx.label}>
          Invalid file
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={sx.chip(false)}>
      {isUnknown ? <HelpOutlineOutlined color="secondary" sx={{ fontSize: 14 }} /> : null}

      <Typography variant="caption" sx={{ ...sx.label, color: 'text.secondary' }}>
        {formatType(bankType).long}
      </Typography>
    </Box>
  )
}

export default Component
