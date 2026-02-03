import { useCallback, useState } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'

import { MISC } from '@/common'
import { useFileParser, type FileParserType } from './useFileParser'

export type UploadingFile = {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'complete' | 'error'
  error?: string
  data?: unknown[]
}

export type UseFileUploadOptions = {
  maxSize?: number
  accept?: DropzoneOptions['accept']
  multiple?: boolean
  parserType?: FileParserType
  onUploadComplete?: (file: UploadingFile) => void
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxSize = MISC.MAX_UPLOAD_FILE_SIZE,
    accept,
    multiple = true,
    parserType = 'csv',
    onUploadComplete,
  } = options

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const { parseFile } = useFileParser({
    parserType,
    onProgress: (fileId, progress) => {
      setUploadingFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
    },
    onComplete: (fileId, data) => {
      setUploadingFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === fileId ? { ...f, progress: 100, status: 'complete' as const, data } : f,
        )
        const completedFile = updated.find((f) => f.id === fileId)
        if (completedFile && onUploadComplete) {
          onUploadComplete(completedFile)
        }
        return updated
      })
    },
    onError: (fileId, error) => {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: 'error' as const, error: error.message } : f)),
      )
    },
    storeInSessionStorage: true,
  })

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectedFiles(fileRejections)

      const newFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        progress: 0,
        status: 'uploading',
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles])

      newFiles.forEach((f) => parseFile(f.id, f.file))
    },
    [parseFile],
  )

  const removeFile = useCallback((fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  const clearRejectedFiles = useCallback(() => {
    setRejectedFiles([])
  }, [])

  const clearAllFiles = useCallback(() => {
    setUploadingFiles([])
    setRejectedFiles([])
  }, [])

  const dropzone = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  })

  return {
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
    isDragActive: dropzone.isDragActive,
    uploadingFiles,
    rejectedFiles,
    removeFile,
    clearRejectedFiles,
    clearAllFiles,
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
