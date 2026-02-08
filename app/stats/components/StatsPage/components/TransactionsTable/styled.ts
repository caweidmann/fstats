export const ui = () => {
  return {
    searchContainer: {
      mt: 1,
      mb: 3,
    },

    searchField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
    },

    tableHeader: {
      fontWeight: 600,
      fontSize: '0.8125rem',
      color: 'text.secondary',
      py: 1.5,
    },

    tableRow: {
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    },

    compactCell: {
      py: 1,
    },

    descriptionCell: {
      display: 'flex',
      alignItems: 'center',
    },

    categoryChip: {
      borderRadius: 1.5,
      fontWeight: 500,
      fontSize: '0.7rem',
      height: 22,
    },
  }
}
