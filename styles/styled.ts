import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { LAYOUT } from '@/common'

export const ExternalLinkPrimary = styled('a')(({ theme }) => {
  return {
    fontWeight: 'bold',
    color: theme.vars.palette.primary.main,
    textDecoration: 'none',
    transition: 'all .2s linear',
    borderBottom: `2px solid ${theme.vars.palette.divider}`,

    '&:hover': {
      borderBottom: `2px solid ${theme.vars.palette.secondary.main}`,
    },
  }
})

export const ExternalLink = styled('a')(({ theme }) => {
  return {
    textDecoration: 'none',
    color: 'inherit',
    borderBottom: '1px solid currentColor',
    transition: 'all .2s linear',

    '&:hover': {
      color: theme.vars.palette.text.primary,
    },
  }
})

export const sxPbig = {
  fontSize: 18,
  lineHeight: 1.8,
}

export const sxBlueBorderBefore = (theme: Theme) => ({
  content: '""',
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 5,
  height: '80%',
  background: 'linear-gradient(to bottom, var(--mui-palette-info-main), var(--mui-palette-info-light))',
  borderRadius: 100,
})

export const sxBlueBorderBottom = (theme: Theme) => ({
  content: '""',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  height: 3,
  background: 'linear-gradient(to bottom, var(--mui-palette-info-main), var(--mui-palette-info-light))',
  borderRadius: 100,
})
