'use client'

import { Box } from '@mui/material'
import type { ReactNode } from 'react'

import { LAYOUT } from '@/common'
import { useIsMobile } from '@/hooks'

type PageWrapperProps = {
  children: ReactNode
}

const Component = ({ children }: PageWrapperProps) => {
  const isMobile = useIsMobile()

  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        maxWidth: '100%',
        minHeight: `calc(100vh - ${(isMobile ? LAYOUT.NAV_HEIGHT_MOBILE : LAYOUT.NAV_HEIGHT) + LAYOUT.NAV_BORDER + (isMobile ? LAYOUT.FOOTER_HEIGHT_MOBILE : LAYOUT.FOOTER_HEIGHT) + LAYOUT.FOOTER_BORDER}px)`,

        '@media print': {
          maxWidth: 'none',
          overflowX: 'visible',
          p: 0,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default Component
