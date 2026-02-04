import { Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ui } from './styled'

type MainMenuNavButtonProps = {
  route: string
  children: ReactNode
  icon?: ReactNode
  isActive?: boolean
}

const Component = ({ route, children, icon, isActive = false }: MainMenuNavButtonProps) => {
  const theme = useTheme()
  const sx = ui(theme)

  return (
    <Link href={route}>
      <Button color={isActive ? 'primary' : 'secondary'} sx={sx.button(isActive)} startIcon={icon}>
        <Typography color={isActive ? 'primary' : 'secondary'} sx={sx.text(isActive)}>
          {children}
        </Typography>
      </Button>
    </Link>
  )
}

export default Component
