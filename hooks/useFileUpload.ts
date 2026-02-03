import { useCallback, useState } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'

import { MISC } from '@/common'

export type UploadingFile = {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'complete' | 'error'
  error?: string
}

export type UseFileUploadOptions = {
  maxSize?: number
  accept?: DropzoneOptions['accept']
  multiple?: boolean
  onUploadComplete?: (file: UploadingFile) => void
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { maxSize = MISC.MAX_UPLOAD_FILE_SIZE, accept, multiple = true, onUploadComplete } = options

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const simulateUpload = useCallback(
    (fileId: string) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadingFiles((prev) => {
            const updated = prev.map((f) =>
              f.id === fileId ? { ...f, progress: 100, status: 'complete' as const } : f,
            )
            const completedFile = updated.find((f) => f.id === fileId)
            if (completedFile && onUploadComplete) {
              onUploadComplete(completedFile)
            }
            return updated
          })
        } else {
          setUploadingFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
        }
      }, 150)
    },
    [onUploadComplete],
  )

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

      // Start simulated upload for each file
      newFiles.forEach((f) => simulateUpload(f.id))
    },
    [simulateUpload],
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
    // Dropzone props
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps,
    isDragActive: dropzone.isDragActive,
    // File state
    uploadingFiles,
    rejectedFiles,
    // Actions
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
