'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { formatISO } from 'date-fns'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileRejection, FileWithPath } from 'react-dropzone'

import { StatsFile } from '@/types'
import { MISC } from '@/common'
import { useStorage } from '@/context/Storage'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'

import { ui } from './styled'

const Component = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { addFiles, updateFile } = useStorage()

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
    const newFiles: StatsFile[] = []

    acceptedFiles.map((file) => {
      newFiles.push({
        id: crypto.randomUUID(),
        uploaded: formatISO(new Date()),
        file,
        status: 'parsing',
      })
    })

    fileRejections.map(({ file, errors }) => {
      newFiles.push({
        id: crypto.randomUUID(),
        uploaded: formatISO(new Date()),
        file,
        status: 'error',
        error: errors.map((e) => e.message).join(', '),
      })
    })

    await addFiles(newFiles)
    const parsedFiles = await parseFiles(newFiles.filter((file) => file.status === 'parsing'))
    const promises = parsedFiles.map((file) => updateFile(file.id, file))
    await Promise.all(promises)
  }, [])

  const dropzone = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxSize: MISC.MAX_UPLOAD_FILE_SIZE,
    multiple: true,
  })

  return (
    <Box {...dropzone.getRootProps()} sx={sx.dropZone(dropzone.isDragActive)}>
      <input id="dropzone-file-input" {...dropzone.getInputProps()} />
      <CloudUploadOutlined sx={sx.uploadIcon} />
      <Typography variant="h5">Drop your files here</Typography>
      <Typography variant="body2" color="text.secondary">
        or click to select files
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        CSV files only, max 5MB each
      </Typography>
    </Box>
  )
}

export default Component
