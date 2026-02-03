import { Box } from '@mui/material'
import type { ReactNode } from 'react'

import { LAYOUT } from '@/common'

type PageWrapperProps = {
  children: ReactNode
}

const Component = ({ children }: PageWrapperProps) => {
  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        maxWidth: '100%',
        minHeight: `calc(100vh - ${LAYOUT.NAV_HEIGHT + LAYOUT.NAV_BORDER + LAYOUT.FOOTER_HEIGHT + LAYOUT.FOOTER_BORDER}px)`,

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
