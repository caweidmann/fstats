'use client'

import { DeleteOutlined, FolderOutlined, StorageRounded } from '@mui/icons-material'
import { Box, Button, Card, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { useFiles, useMutateRemoveAllFiles } from '@/m-stats-file/service'
import { formatFileSize } from '@/utils/File'

import { calculateStorageSize } from './actions'
import { ui } from './styled'

const Component = () => {
  const sx = ui()
  const { data: files = [], isLoading: isLoadingFiles } = useFiles()
  const { mutate: removeAllFiles, isPending: isRemoving } = useMutateRemoveAllFiles()
  const [storageSize, setStorageSize] = useState<string>(formatFileSize(0))
  const [isCalculating, setIsCalculating] = useState(true)

  useEffect(() => {
    const calculateInfo = async () => {
      setIsCalculating(true)
      try {
        const size = await calculateStorageSize()
        setStorageSize(formatFileSize(size))
      } catch {
        setStorageSize('Failed to calculate')
      } finally {
        setIsCalculating(false)
      }
    }

    calculateInfo()
  }, [files.length])

  const fileCount = files.length
  const hasFiles = fileCount > 0

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Storage details
      </Typography>

      <Box sx={sx.statsContainer}>
        <Box sx={sx.statItem}>
          <FolderOutlined sx={sx.statIcon} />
          <Box>
            <Typography sx={sx.statValue(isLoadingFiles)}>{fileCount}</Typography>
            <Typography variant="caption" sx={sx.statLabel}>
              {fileCount === 1 ? 'File' : 'Files'}
            </Typography>
          </Box>
        </Box>

        <Box sx={sx.statItem}>
          <StorageRounded sx={sx.statIcon} />
          <Box>
            <Typography sx={sx.statValue(isLoadingFiles || isCalculating)}>{storageSize}</Typography>
            <Typography variant="caption" sx={sx.statLabel}>
              Storage used
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        color="error"
        variant="outlined"
        startIcon={<DeleteOutlined />}
        onClick={() => removeAllFiles()}
        disabled={!hasFiles}
        loading={isRemoving}
      >
        Clear all data
      </Button>
    </Card>
  )
}

export default Component
