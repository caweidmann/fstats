'use client'

import { Box, Card, Chip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type StyledCardProps = {
  url: string
  name: string
  description: string
  skills?: { id: string; name: string }[]
}

const Component = ({ url, name, description, skills = [] }: StyledCardProps) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(theme, isMobile)
  const { t } = useTranslation()

  return (
    <Card component="a" href={url} target="_blank" rel="noopener noreferrer" sx={sx.card}>
      <Typography variant="body2" sx={sx.title}>
        {t(name)}
      </Typography>
      <Typography variant="body2" sx={sx.description}>
        {t(description)}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {skills?.slice(0, 4).map((skill) => (
          <Chip key={skill.id} label={skill.name} size="small" sx={{ fontSize: 12 }} />
        ))}
      </Box>
    </Card>
  )
}

export default Component
