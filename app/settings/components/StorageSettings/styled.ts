export const ui = () => {
  return {
    statsContainer: {
      display: 'flex',
      gap: 3,
      mb: 3,
      pb: 2,
      borderBottom: '1px solid',
      borderColor: 'divider',
    },

    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },

    statIcon: {
      fontSize: 20,
      color: 'text.secondary',
    },

    statValue: {
      fontWeight: 600,
      color: 'text.primary',
      mr: 1,
    },

    statLabel: {
      color: 'text.secondary',
      fontSize: '0.75rem',
    },
  }
}
