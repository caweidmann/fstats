import { Box, Container, Divider, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { LAYOUT } from '@/common'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

const Component = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const sx = ui(theme)
  const { t } = useTranslation()

  return (
    <Box className="hide-print">
      <Divider />

      <Container component="footer" maxWidth={LAYOUT.CONTAINER_MAX_WIDTH}>
        <Box sx={sx.footer}>
          <Typography color="primary" sx={{ fontSize: 13 }}>
            © 2025 {t('RESUME.FULL_NAME')}. {isMobile ? <br /> : null}
            {t('MISC.ALL_RIGHTS_RESERVED')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Component
