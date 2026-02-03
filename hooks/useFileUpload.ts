import { useCallback, useEffect, useState } from 'react'
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

  // Restore uploaded files from session storage on mount
  useEffect(() => {
    try {
      const uploadedFilesMetadata = JSON.parse(sessionStorage.getItem('uploaded_files') || '[]')

      if (uploadedFilesMetadata.length > 0) {
        const restoredFiles: UploadingFile[] = uploadedFilesMetadata.map(
          (metadata: { id: string; name: string; size: number }) => {
            // Try to get the parsed data for this file
            const dataStr = sessionStorage.getItem(`file_${metadata.id}`)
            const data = dataStr ? JSON.parse(dataStr) : undefined

            // Create a minimal File object for display purposes
            const file = new File([], metadata.name, { type: 'text/csv' })
            Object.defineProperty(file, 'size', { value: metadata.size })

            return {
              id: metadata.id,
              file,
              progress: 100,
              status: 'complete' as const,
              data,
            }
          },
        )

        setUploadingFiles(restoredFiles)
      }
    } catch (error) {
      console.error('Failed to restore files from session storage:', error)
    }
  }, [])

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

        // Store file metadata in session storage for later retrieval
        try {
          const fileMetadata = {
            id: fileId,
            name: completedFile?.file.name,
            size: completedFile?.file.size,
          }
          const existingFiles = JSON.parse(sessionStorage.getItem('uploaded_files') || '[]')
          const updatedFiles = [...existingFiles.filter((f: { id: string }) => f.id !== fileId), fileMetadata]
          sessionStorage.setItem('uploaded_files', JSON.stringify(updatedFiles))
        } catch (error) {
          console.error('Failed to store file metadata:', error)
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

    // Remove from session storage
    try {
      sessionStorage.removeItem(`file_${fileId}`)
      const existingFiles = JSON.parse(sessionStorage.getItem('uploaded_files') || '[]')
      const updatedFiles = existingFiles.filter((f: { id: string }) => f.id !== fileId)
      sessionStorage.setItem('uploaded_files', JSON.stringify(updatedFiles))
    } catch (error) {
      console.error('Failed to remove file from session storage:', error)
    }
  }, [])

  const clearRejectedFiles = useCallback(() => {
    setRejectedFiles([])
  }, [])

  const clearAllFiles = useCallback(() => {
    setUploadingFiles([])
    setRejectedFiles([])

    // Clear from session storage
    try {
      const uploadedFilesMetadata = JSON.parse(sessionStorage.getItem('uploaded_files') || '[]')
      uploadedFilesMetadata.forEach((metadata: { id: string }) => {
        sessionStorage.removeItem(`file_${metadata.id}`)
      })
      sessionStorage.removeItem('uploaded_files')
    } catch (error) {
      console.error('Failed to clear files from session storage:', error)
    }
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
