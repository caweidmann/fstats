import type { Theme } from '@mui/material/styles'

import { Color } from '@/styles/colors'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    hero: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      textAlign: 'center' as const,
      pt: isMobile ? 2 : 6,
      pb: isMobile ? 2 : 4,
    },

    heroTitle: {
      fontSize: isMobile ? 28 : 40,
      fontWeight: 800,
      lineHeight: 1.2,
      mb: 2,
    },

    heroTitleAccent: {
      color: isDarkMode ? Color.cyan : Color.cyanDark,
    },

    heroSubtitle: {
      color: 'text.secondary',
      maxWidth: 540,
      fontSize: isMobile ? 15 : 17,
      lineHeight: 1.7,
      mb: 4,
    },

    ctaButton: {
      minWidth: 200,
      py: 1.5,
      px: 5,
      fontSize: 17,
      fontWeight: 600,
      borderRadius: 3,
    },

    trustSection: {
      mt: isMobile ? 4 : 6,
    },

    trustCard: {
      p: isMobile ? 2.5 : 3,
      borderRadius: 2,
      border: `1px solid ${isDarkMode ? 'rgba(0,188,212,0.18)' : 'rgba(0,96,100,0.15)'}`,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,96,100,0.04)',
      textAlign: 'center' as const,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },

    trustIcon: {
      fontSize: 34,
      color: isDarkMode ? Color.cyan : Color.cyanDark,
      mb: 1.5,
    },

    trustTitle: {
      fontWeight: 700,
      mb: 0.75,
    },

    trustDescription: {
      color: 'text.secondary',
      fontSize: 14,
      lineHeight: 1.6,
      mb: 0,
    },

    section: {
      mt: isMobile ? 5 : 7,
    },

    sectionTitle: {
      textAlign: 'center' as const,
      fontWeight: 700,
      mt: 12,
      mb: isMobile ? 3 : 5,
    },

    stepCard: {
      textAlign: 'center' as const,
    },

    stepBadge: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      // mb: 1.5,
      mb: 4,
      background: isDarkMode
        ? 'linear-gradient(135deg, rgba(0,188,212,0.25), rgba(0,96,100,0.2))'
        : 'linear-gradient(135deg, rgba(0,188,212,0.18), rgba(0,96,100,0.12))',
      color: isDarkMode ? Color.cyan : Color.cyanDark,
      fontWeight: 700,
      fontSize: 18,
    },

    stepIcon: {
      fontSize: 28,
      color: 'text.secondary',
      mb: 1,
    },

    stepTitle: {
      fontWeight: 600,
      mb: 0.75,
    },

    stepDescription: {
      color: 'text.secondary',
      fontSize: 14,
      lineHeight: 1.6,
      mb: 0,
    },

    banksSection: {
      mt: isMobile ? 5 : 7,
    },

    bankGrid: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 1.5,
      justifyContent: 'center',
    },

    bankChip: {
      border: `1px solid ${isDarkMode ? 'rgba(0,188,212,0.3)' : 'rgba(0,96,100,0.2)'}`,
      color: isDarkMode ? Color.cyan : Color.cyanDark,
      backgroundColor: isDarkMode ? 'rgba(0,188,212,0.08)' : 'rgba(0,96,100,0.05)',
      fontWeight: 600,
      fontSize: 14,
      height: 38,
    },
  }
}
