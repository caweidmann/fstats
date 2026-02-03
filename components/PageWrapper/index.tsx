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
  // const headerHeight = isMobile ? LAYOUT.HEADER_HEIGHT_MOBILE : LAYOUT.HEADER_HEIGHT
  // const footerHeight = isMobile ? LAYOUT.FOOTER_HEIGHT_MOBILE : LAYOUT.FOOTER_HEIGHT

  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        maxWidth: '100%',
        // minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
        overflowX: 'auto',

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
