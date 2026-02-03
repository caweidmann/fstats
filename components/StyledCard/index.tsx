'use client'

import { Box, Card, Chip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { Project } from '@/types'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type StyledCardProps = {
  project: Project
}

const Component = ({ project }: StyledCardProps) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(theme, isMobile)
  const { t } = useTranslation()

  return (
    <Card component="a" href={project.url} target="_blank" rel="noopener noreferrer" sx={sx.card}>
      <Typography variant="body2" sx={sx.title}>
        {t(project.name)}
      </Typography>
      <Typography variant="body2" sx={sx.description}>
        {t(project.description)}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {project.skills?.slice(0, 4).map((skill) => (
          <Chip key={skill.id} label={skill.name} size="small" sx={{ fontSize: 12 }} />
        ))}
      </Box>
    </Card>
  )
}

export default Component
