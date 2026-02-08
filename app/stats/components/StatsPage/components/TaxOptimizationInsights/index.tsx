'use client'

import {
  CheckCircle,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Lightbulb,
  SavingsOutlined,
  TrendingDown,
} from '@mui/icons-material'
import { Alert, Box, Card, Chip, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { blue, green, orange } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

import { useIsMobile } from '@/hooks'

import { DEMO_TAX_INSIGHTS, type OptimizationInsight } from '../../demo-data'
import { ui } from './styled'

type ComponentProps = {
  isDemoMode: boolean
}

const Component = ({ isDemoMode }: ComponentProps) => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const sx = ui(theme, isMobile)
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Only show insights in demo mode, otherwise show "coming soon"
  const insights = isDemoMode ? DEMO_TAX_INSIGHTS : []
  const totalPotentialSavings = insights.reduce((sum, insight) => sum + insight.taxSavings, 0)

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
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          spacing={isMobile ? 1.5 : 0}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Lightbulb sx={{ color: orange[500] }} />
            <Typography variant="h6" fontWeight="medium">
              Tax Optimisation Recommendations
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            {isDemoMode ? (
              <Chip
                icon={<SavingsOutlined sx={{ fontSize: 18, mr: 1 }} />}
                label={
                  isMobile
                    ? `Save ${formatCurrency(totalPotentialSavings)}`
                    : `Save ${formatCurrency(totalPotentialSavings)} - See how`
                }
                size="medium"
                color="success"
                sx={{
                  fontWeight: 600,
                  py: 2.25,
                  px: 1,
                  '& .MuiChip-label': {
                    pl: 2,
                  },
                }}
              />
            ) : (
              <Chip label="Coming Soon" size="small" color="default" variant="outlined" />
            )}
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
          {!isDemoMode ? (
            <Alert severity="info" icon={<Lightbulb />} sx={{ borderRadius: 1.75, p: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Tax Optimisation Features Coming Soon
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                We're working on intelligent tax optimisation recommendations based on your actual transactions. This
                feature will analyse your spending patterns and suggest ways to maximise your tax deductions.
              </Typography>
            </Alert>
          ) : (
            <>
              <Alert severity="info" icon={<SavingsOutlined />} sx={{ borderRadius: 1.75, p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Estimated savings potential: {formatCurrency(totalPotentialSavings)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Strategic spending in these categories can significantly reduce your tax burden.
                </Typography>
              </Alert>

              <List>
                {insights.map((insight, index) => (
                  <ListItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    sx={{
                      ...sx.insightItem,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'flex-start',
                    }}
                    secondaryAction={
                      !isMobile ? (
                        <Box sx={sx.savingsBox}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Savings
                          </Typography>
                          <Typography variant="h6" sx={{ color: green[600], fontWeight: 600 }}>
                            {formatCurrency(insight.taxSavings)}
                          </Typography>
                        </Box>
                      ) : null
                    }
                  >
                    <ListItemIcon sx={{ minWidth: isMobile ? 36 : 56 }}>
                      <TrendingDown sx={{ color: blue[500] }} />
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
                        <Box component="span" sx={{ mt: 1, display: 'block' }}>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                          >
                            {insight.description}
                          </Typography>
                          <Box component="span" sx={{ ...sx.amountDetails, display: 'block' }}>
                            {insight.currentSpend > 0 && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ color: 'text.secondary', display: 'block' }}
                              >
                                Current spend: {formatCurrency(insight.currentSpend)}
                              </Typography>
                            )}
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: blue[600], fontWeight: 500, display: 'block' }}
                            >
                              Recommended spend: {formatCurrency(insight.potentialIncrease)}
                            </Typography>
                            {isMobile && (
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: green[600], fontWeight: 600, display: 'block', mt: 1 }}
                              >
                                Potential savings: {formatCurrency(insight.taxSavings)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={sx.summaryBox}>
                <CheckCircle sx={{ color: green[500], mr: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
                  <strong>Note:</strong> These recommendations are based on your current transactions. Consult a tax
                  advisor for personalised advice.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      ) : null}
    </Card>
  )
}

export default Component
