'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileRejection, FileWithPath } from 'react-dropzone'

import { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { getStatsFileDefaults, useMutateAddFiles, useMutateUpdateFiles } from '@/m-stats-file/service'
import { useFileHelper, useIsDarkMode, useIsMobile, useUserPreferences } from '@/hooks'
import { parseFiles } from '@/utils/FileParser'

import { ui } from './styled'

const Component = () => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)
  const { mutateAsync: addFiles } = useMutateAddFiles()
  const { mutateAsync: updateFiles } = useMutateUpdateFiles()
  const { setSelectedFileIds } = useFileHelper()
  const { locale, dateFormat } = useUserPreferences()

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      const newFiles: StatsFile[] = []

      acceptedFiles.forEach((file) => {
        newFiles.push(getStatsFileDefaults(file))
      })

      fileRejections.forEach(({ file, errors }) => {
        newFiles.push({
          ...getStatsFileDefaults(file),
          status: StatsFileStatus.ERROR,
          error: errors.map((e) => e.message).join(', '),
        })
      })

      const addedFiles = await addFiles(newFiles)
      const parsedFiles = await parseFiles(
        addedFiles.filter((file) => file.status === StatsFileStatus.PARSING),
        locale,
        dateFormat,
      )
      await updateFiles(parsedFiles.map((file) => ({ id: file.id, updates: file })))
      setSelectedFileIds((prev) => [
        ...prev,
        ...parsedFiles.filter((file) => file.status !== StatsFileStatus.ERROR).map((file) => file.id),
      ])
    },
    [addFiles, updateFiles, setSelectedFileIds, locale],
  )

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
