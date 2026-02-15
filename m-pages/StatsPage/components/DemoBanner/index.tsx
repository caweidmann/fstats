import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { useIsMobile } from '@/hooks'

const Component = () => {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        py: 1.5,
        px: 3,
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1.5 : 0,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0 }}>
        You are viewing demo data
      </Typography>
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: '#fff',
          borderColor: '#fff',
          '&:hover': {
            borderColor: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
        onClick={() => router.push(ROUTES.DATA)}
      >
        Upload your data
      </Button>
    </Box>
  )
}

export default Component
