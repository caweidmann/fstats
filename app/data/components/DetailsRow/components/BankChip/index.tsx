import { Chip } from '@mui/material'

import type { FileData } from '@/types'

type BankChipProps = {
  file: FileData
}

const Component = ({ file }: BankChipProps) => {
  return (
    <Chip
      label={file.parsedType}
      size="small"
      color={file.parsedType === 'unknown' ? 'secondary' : 'info'}
      variant="outlined"
      sx={{ height: 18, fontSize: '0.7rem' }}
    />
  )
}

export default Component
