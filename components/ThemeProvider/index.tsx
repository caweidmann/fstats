import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { MISC } from '@/common'
import { theme } from '@/styles/theme'

type ThemeProviderProps = {
  children: ReactNode
}

const Component = ({ children }: ThemeProviderProps) => {
  return (
    <ThemeProvider theme={theme} defaultMode={MISC.DEFAULT_COLOR_MODE}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default Component
