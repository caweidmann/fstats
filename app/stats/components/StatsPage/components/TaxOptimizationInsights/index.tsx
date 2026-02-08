'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import SavingsIcon from '@mui/icons-material/Savings'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { Alert, Box, Card, Chip, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { blue, green, orange } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import { useIsMobile } from '@/hooks'

import { ui } from './styled'

type OptimizationInsight = {
  category: string
  currentSpend: number
  potentialIncrease: number
  taxSavings: number
  description: string
  priority: 'high' | 'medium' | 'low'
}

// Dummy insights
const DUMMY_INSIGHTS: OptimizationInsight[] = [
  {
    category: 'Home Office',
    currentSpend: 0,
    potentialIncrease: 1260,
    taxSavings: 274.68,
    description: 'You can claim up to €1,260/year for home office expenses.',
    priority: 'high',
  },
  {
    category: 'Professional Development',
    currentSpend: 0,
    potentialIncrease: 2000,
    taxSavings: 436.0,
    description: 'Courses, certifications, and professional literature are fully deductible.',
    priority: 'high',
  },
  {
    category: 'Retirement Contributions',
    currentSpend: 0,
    potentialIncrease: 5000,
    taxSavings: 1090.0,
    description: 'Contributions to qualified retirement plans significantly reduce your tax burden.',
    priority: 'medium',
  },
  {
    category: 'Business Equipment',
    currentSpend: 87.45,
    potentialIncrease: 1500,
    taxSavings: 327.0,
    description: 'Investments in office furniture, computers, and software are deductible.',
    priority: 'medium',
  },
]

const Component = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const sx = ui(theme, isMobile)
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const totalPotentialSavings = DUMMY_INSIGHTS.reduce((sum, insight) => sum + insight.taxSavings, 0)

  const getPriorityColor = (priority: OptimizationInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
    }
  }

  const getPriorityLabel = (priority: OptimizationInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'High Priority'
      case 'medium':
        return 'Medium Priority'
      case 'low':
        return 'Low Priority'
    }
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box sx={sx.summaryCard()} onClick={() => setExpanded(!expanded)}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <LightbulbIcon sx={{ color: orange[500] }} />
            <Typography variant="h6" fontWeight="medium">
              Tax Optimization Recommendations
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<SavingsIcon sx={{ fontSize: 16 }} />}
              label={`${formatCurrency(totalPotentialSavings)} potential savings`}
              size="small"
              color="success"
              variant="outlined"
            />
            {expanded ? (
              <ExpandLessOutlined sx={{ color: 'text.secondary' }} />
            ) : (
              <ExpandMoreOutlined sx={{ color: 'text.secondary' }} />
            )}
          </Stack>
        </Stack>
      </Box>

      {expanded ? (
        <Box sx={{ mt: 3, px: 3, pb: 3 }}>
          <Alert severity="info" icon={<SavingsIcon />} sx={{ borderRadius: 1.75, p: 2 }}>
            <Typography component="div" variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Estimated savings potential: {formatCurrency(totalPotentialSavings)}
            </Typography>
            <Typography component="div" variant="caption" sx={{ color: 'text.secondary' }}>
              Strategic spending in these categories can significantly reduce your tax burden.
            </Typography>
          </Alert>

          <List>
            {DUMMY_INSIGHTS.map((insight, index) => (
              <ListItem
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                sx={sx.insightItem}
                secondaryAction={
                  <Box sx={sx.savingsBox}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Savings
                    </Typography>
                    <Typography variant="h6" sx={{ color: green[600], fontWeight: 600 }}>
                      {formatCurrency(insight.taxSavings)}
                    </Typography>
                  </Box>
                }
              >
                <ListItemIcon>
                  <TrendingDownIcon sx={{ color: blue[500] }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={sx.insightHeader}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {insight.category}
                      </Typography>
                      <Chip
                        label={getPriorityLabel(insight.priority)}
                        size="small"
                        color={getPriorityColor(insight.priority)}
                        sx={sx.priorityChip}
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="div" sx={{ mt: 1 }}>
                      <Typography component="div" variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {insight.description}
                      </Typography>
                      <Box component="div" sx={sx.amountDetails}>
                        {insight.currentSpend > 0 && (
                          <Typography component="div" variant="caption" sx={{ color: 'text.secondary' }}>
                            Current spend: {formatCurrency(insight.currentSpend)}
                          </Typography>
                        )}
                        <Typography component="div" variant="caption" sx={{ color: blue[600], fontWeight: 500 }}>
                          Recommended spend: {formatCurrency(insight.potentialIncrease)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={sx.summaryBox}>
            <CheckCircleIcon sx={{ color: green[500], mr: 1 }} />
            <Typography component="div" variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
              <strong>Note:</strong> These recommendations are based on your current transactions. Consult a tax advisor
              for personalized advice.
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Card>
  )
}

export default Component
