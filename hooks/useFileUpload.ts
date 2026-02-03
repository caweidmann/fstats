import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'

import { MISC } from '@/common'
import { indexedDBService } from '@/lib/storage/indexedDB'
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

  // Restore uploaded files from IndexedDB on mount
  useEffect(() => {
    const restoreFiles = async () => {
      try {
        await indexedDBService.init()
        const allFiles = await indexedDBService.getAllFiles()

        if (allFiles.length > 0) {
          const restoredFiles: UploadingFile[] = allFiles.map((fileData) => {
            // Create a minimal File object for display purposes
            const file = new File([], fileData.name, { type: 'text/csv' })
            Object.defineProperty(file, 'size', { value: fileData.size })

            return {
              id: fileData.id,
              file,
              progress: 100,
              status: 'complete' as const,
              data: fileData.data,
            }
          })

          setUploadingFiles(restoredFiles)
        }
      } catch (error) {
        console.error('Failed to restore files from IndexedDB:', error)
      }
    }

    restoreFiles()
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

        // File metadata is now stored in IndexedDB by useFileParser
        return updated
      })
    },
    onError: (fileId, error) => {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: 'error' as const, error: error.message } : f)),
      )
    },
    storeInIndexedDB: true,
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

  const removeFile = useCallback(async (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))

    // Remove from IndexedDB
    try {
      await indexedDBService.deleteFile(fileId)
    } catch (error) {
      console.error('Failed to remove file from IndexedDB:', error)
    }
  }, [])

  const clearRejectedFiles = useCallback(() => {
    setRejectedFiles([])
  }, [])

  const clearAllFiles = useCallback(async () => {
    setUploadingFiles([])
    setRejectedFiles([])

    // Clear from IndexedDB
    try {
      await indexedDBService.clearAllFiles()
    } catch (error) {
      console.error('Failed to clear files from IndexedDB:', error)
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
