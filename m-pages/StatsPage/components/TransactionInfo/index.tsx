import { Box, Typography } from '@mui/material'

import { MISC } from '@/common'

import { ui } from './styled'

type TransactionInfoProps = {
  total: number
  duplicates: number
}

const Component = ({ total, duplicates }: TransactionInfoProps) => {
  const sx = ui()

  return (
    <Box sx={sx.container}>
      <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>
        {total - duplicates} Transaction{total - duplicates !== 1 ? 's' : ''}
      </Typography>
      {duplicates > 0 ? (
        <>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>{` ${MISC.CENTER_DOT} `}</Typography>
          <Typography sx={{ fontSize: 15, color: 'info.dark' }}>{total} detected</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>{` ${MISC.CENTER_DOT} `}</Typography>
          <Typography sx={{ fontSize: 15, color: 'info.light' }}>
            {duplicates} duplicate{duplicates !== 1 ? 's' : ''} removed
          </Typography>
        </>
      ) : null}
    </Box>
  )
}

export default Component
