'use client'

import { DeleteOutlined, ErrorOutlined } from '@mui/icons-material'
import { Box, Checkbox, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import { FileData } from '@/types'
import { MISC } from '@/common'
import { useStorage } from '@/context/Storage'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'

import { ui } from './styled'

type DetailsRowProps = {
  file: FileData
}

const Component = ({ file }: DetailsRowProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const { selectedFileIds, setSelectedFileIds, removeFile } = useStorage()
  const isSelected = selectedFileIds.includes(file.id)

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  return (
    <Box
      key={file.id}
      sx={sx.fileCard(!!file.error)}
      onClick={file.error ? undefined : () => toggleFileSelection(file.id)}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {file.error ? (
          <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
            <ErrorOutlined sx={{ color: 'error.main', fontSize: 18 }} />
          </Box>
        ) : (
          <Checkbox
            checked={isSelected}
            onChange={() => toggleFileSelection(file.id)}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{ p: 0.5 }}
          />
        )}

        <Box sx={sx.fileContentBox}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="body2"
              color={file.error ? 'error' : 'text.primary'}
              fontWeight="medium"
              sx={sx.fileName}
            >
              {file.file.name}
            </Typography>
            {file.error && (
              <Chip
                label="Failed"
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.7rem' }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(file.file.size)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Uploaded{' '}
              {toDisplayDate(new Date(file.uploaded), locale, {
                formatTo: 'd MMM yyyy, HH:mm:ss',
              })}
            </Typography>

            {file.error ? (
              <>
                <Typography variant="caption" color="text.secondary">
                  {MISC.CENTER_DOT}
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                  {file.error}
                </Typography>
              </>
            ) : null}
          </Stack>
        </Box>

        <Tooltip title="Remove file">
          <IconButton
            color={file.error ? 'error' : 'secondary'}
            onClick={() => removeFile(file.id)}
            sx={sx.deleteButton}
          >
            <DeleteOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  )
}

export default Component
