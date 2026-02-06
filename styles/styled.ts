import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

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

export const sxMenuPaper = (theme: Theme, isMobile = false) => {
  return {
    px: 1,
    marginTop: 0.5,
    maxHeight: isMobile ? '40%' : '50%',
    border: `1px solid ${theme.vars.palette.divider}`,
    boxShadow: `0 1px 1px hsl(0deg 0% 0% / 0.075),
                0 2px 2px hsl(0deg 0% 0% / 0.075),
                0 4px 4px hsl(0deg 0% 0% / 0.075)`,
  }
}

export const sxMenuItem = (isLastItem = false) => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    p: 1,
    mb: isLastItem ? 0 : 0.5,
    borderRadius: 1,
    textAlign: 'left',
    whiteSpace: 'normal',
  }
}
