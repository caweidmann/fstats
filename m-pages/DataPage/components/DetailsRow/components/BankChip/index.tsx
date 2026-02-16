'use client'

import { ErrorOutlineOutlined, HelpOutlineOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { StatsFile } from '@/types'
import { isError, isUnknown } from '@/m-stats-file/service'
import { getParserName } from '@/parsers'

import { ui } from './styled'

type BankChipProps = {
  file: StatsFile
}

const Component = ({ file }: BankChipProps) => {
  const theme = useTheme()
  const sx = ui(theme)
  const isErrorFile = isError(file)
  const isUnknownFile = isUnknown(file)

  if (isErrorFile) {
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
    <Box sx={sx.chip(isUnknownFile)}>
      {isUnknownFile ? <HelpOutlineOutlined color="warning" sx={{ fontSize: 14 }} /> : null}

      <Typography variant="caption" sx={{ ...sx.label, color: isUnknownFile ? 'warning.main' : 'text.secondary' }}>
        {getParserName(file.parserId).long}
      </Typography>
    </Box>
  )
}

export default Component
