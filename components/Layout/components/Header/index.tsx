import { Box, Container, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'

import { LAYOUT, MISC, ROUTES } from '@/common'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import MainMenu from '../MainMenu'
import { ui } from './styled'

type HeaderProps = {
  onMenuClick: VoidFunction
}

const Component = ({ onMenuClick }: HeaderProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const sx = ui(theme, isMobile)

  return (
    <>
      <Box sx={sx.wrapper} className="hide-print">
        <Container maxWidth={LAYOUT.CONTAINER_MAX_WIDTH}>
          <Box sx={sx.profileWrapper}>
            <Box sx={sx.imageWrapper}>
              <Link href={ROUTES.HOME} style={{ display: 'inline-flex' }}>
                {t('NAVIGATION.HOME')}
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      <MainMenu onMenuClick={onMenuClick} />
    </>
  )
}

export default Component
