import { HomeOutlined, HomeRounded, Menu } from '@mui/icons-material'
import { Box, Container, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { usePathname } from 'next/navigation'

import { LAYOUT, ROUTES } from '@/common'
import { LanguageSwitcher, ThemeSwitcher } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import MainMenuNavButton from '../MainMenuNavButton'
import { getActiveRouteLabel } from './actions'
import { ui } from './styled'

type MainMenuProps = {
  onMenuClick: VoidFunction
}

const Component = ({ onMenuClick }: MainMenuProps) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const sx = ui(theme, isDarkMode, isMobile)
  const activeLabel = getActiveRouteLabel(pathname)

  return (
    <>
      <Container maxWidth={LAYOUT.CONTAINER_MAX_WIDTH} sx={sx.menuContainer}>
        <Box sx={sx.menuWrapper}>
          <Box sx={sx.menu}>
            {isMobile ? (
              <>
                <IconButton color="primary" sx={{ ml: -1 }} onClick={onMenuClick}>
                  <Menu color="primary" />
                </IconButton>
                <Typography color="secondary" sx={{ fontSize: 14 }}>
                  {activeLabel}
                </Typography>
              </>
            ) : (
              <>
                {/* <Tooltip title={t('NAVIGATION.HOME')}>
                  <IconButton
                    size="small"
                    href={ROUTES.HOME}
                    color={pathname === ROUTES.HOME ? 'primary' : 'secondary'}
                    sx={sx.homeButton(pathname === ROUTES.HOME)}
                  >
                    {pathname === ROUTES.HOME ? (
                      <HomeRounded sx={{ fontSize: 18 }} />
                    ) : (
                      <HomeOutlined sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Tooltip> */}
                <MainMenuNavButton route={ROUTES.HOME} isActive={pathname === ROUTES.HOME}>
                  {t('NAVIGATION.HOME')}
                </MainMenuNavButton>
              </>
            )}
          </Box>

          <Box sx={sx.iconMenu}>
            {/* <LanguageSwitcher showLabel={false} /> */}
            <ThemeSwitcher showLabel={false} />
          </Box>
        </Box>
      </Container>
      <Divider sx={{ position: 'sticky', top: LAYOUT.NAV_HEIGHT + 1 }} />
    </>
  )
}

export default Component
