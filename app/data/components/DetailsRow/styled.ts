export const ui = () => {
  return {
    fileCard: (isError: boolean) => ({
      py: 0.5,
      cursor: isError ? 'default' : 'pointer',
      borderRadius: 1.25,
      WebkitTapHighlightColor: 'transparent',
    }),

    fileContentBox: {
      flexGrow: 1,
      minWidth: 0,
    },

    fileName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    deleteButton: {
      ml: 1,
    },
  }
}
