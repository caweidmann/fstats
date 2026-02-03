import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'

import { MISC } from '@/common'
import { indexedDBService } from '@/lib/storage/indexedDB'

import { useFileParser, type FileParserType } from './useFileParser'

export type UploadingFile = {
  id: string
  file: File
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
  const { maxSize = MISC.MAX_UPLOAD_FILE_SIZE, accept, multiple = true, parserType = 'csv', onUploadComplete } = options

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  useEffect(() => {
    const restoreFiles = async () => {
      try {
        await indexedDBService.init()
        const allFiles = await indexedDBService.getAllFiles()

        if (allFiles.length > 0) {
          const restoredFiles: UploadingFile[] = allFiles.map((fileData) => {
            const file = new File([], fileData.name, { type: 'text/csv' })
            Object.defineProperty(file, 'size', { value: fileData.size })

            return {
              id: fileData.id,
              file,
              status: fileData.status,
              data: fileData.data,
              error: fileData.error,
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
    onComplete: (fileId, data) => {
      setUploadingFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === fileId ? { ...f, status: 'complete' as const, data } : f,
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
    storeInIndexedDB: true,
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectedFiles(fileRejections)

      const newFileNames = new Set(acceptedFiles.map((f) => f.name))
      const duplicateIds: string[] = []

      setUploadingFiles((prev) => {
        const duplicates = prev.filter((f) => newFileNames.has(f.file.name))
        duplicateIds.push(...duplicates.map((f) => f.id))
        return prev.filter((f) => !newFileNames.has(f.file.name))
      })

      for (const id of duplicateIds) {
        try {
          await indexedDBService.deleteFile(id)
        } catch (error) {
          console.error('Failed to remove duplicate file from IndexedDB:', error)
        }
      }

      const newFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        status: 'uploading',
      }))

      const rejectedAsUploading: UploadingFile[] = fileRejections.map(({ file, errors }) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        status: 'error' as const,
        error: errors.map((e) => e.message).join(', '),
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles, ...rejectedAsUploading])

      for (const rejectedFile of rejectedAsUploading) {
        try {
          await indexedDBService.storeFile(
            rejectedFile.id,
            rejectedFile.file.name,
            rejectedFile.file.size,
            [],
            'error',
            rejectedFile.error,
          )
        } catch (error) {
          console.error('Failed to store rejected file:', error)
        }
      }

      newFiles.forEach((f) => parseFile(f.id, f.file))
    },
    [parseFile],
  )

  const removeFile = useCallback(async (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
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
