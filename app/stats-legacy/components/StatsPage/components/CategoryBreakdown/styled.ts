export const ui = () => ({
  card: {
    p: 3,
    borderRadius: 2,
  },
  title: {
    mb: 3,
    fontWeight: 600,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },
  categoryRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 0.5,
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },
  colorIndicator: (color: string) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),
  categoryName: {
    fontWeight: 500,
    mb: 0,
  },
  amountInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  amount: {
    fontWeight: 600,
    mb: 0,
  },
  percentage: {
    color: 'text.secondary',
    minWidth: 45,
    textAlign: 'right',
  },
  progressBar: (color: string) => ({
    height: 8,
    borderRadius: 1,
    backgroundColor: 'action.hover',
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
      borderRadius: 1,
    },
  }),
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
})
