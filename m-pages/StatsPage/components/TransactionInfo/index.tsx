import { Box, Typography } from '@mui/material'

import { ui } from './styled'

type TransactionInfoProps = {
  total: number
  duplicates: number
}

const Component = ({ total, duplicates }: TransactionInfoProps) => {
  const sx = ui()

  return (
    <Box sx={sx.container}>
      <Typography sx={sx.label}>
        {total - duplicates} Transaction{total - duplicates !== 1 ? 's' : ''}
      </Typography>
      {duplicates > 0 ? (
        <>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
            {` `}/{` `}
          </Typography>
          <Typography sx={sx.duplicates}>
            {duplicates} duplicate{duplicates !== 1 ? 's' : ''} removed
          </Typography>
        </>
      ) : null}
    </Box>
  )
}

export default Component
