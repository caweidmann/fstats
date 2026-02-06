'use client'

import { ErrorOutlineOutlined, HelpOutlineOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { FileData } from '@/types'

import { ui } from './styled'

type BankChipProps = {
  file: FileData
}

const Component = ({ file }: BankChipProps) => {
  const bankType = file.parsedType || 'unknown'
  const isUnknown = bankType === 'unknown'
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
      {isUnknown ? <HelpOutlineOutlined color="warning" sx={{ fontSize: 14 }} /> : null}

      <Typography variant="caption" sx={{ ...sx.label, color: isUnknown ? 'warning.main' : 'text.secondary' }}>
        {isUnknown ? 'Unknown format' : bankType.charAt(0).toUpperCase() + bankType.slice(1)}
      </Typography>
    </Box>
  )
}

export default Component
