import { useCallback, useState } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'

import { MISC } from '@/common'
import { useStorage } from '@/components'
import { type ParserType } from '@/utils/FileParser'

import { useFileParser } from './useFileParser'

export type UploadingFile = {
  id: string
  file: File
  status: 'uploading' | 'complete' | 'error'
  uploadedAt: number
  error?: string
  data?: unknown[]
}

export type UseFileUploadOptions = {
  maxSize?: number
  accept?: DropzoneOptions['accept']
  multiple?: boolean
  parserType?: ParserType
  onUploadComplete?: (file: UploadingFile) => void
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { maxSize = MISC.MAX_UPLOAD_FILE_SIZE, accept, multiple = true, parserType = 'csv', onUploadComplete } = options
  const { files: storedFiles, storeFile, deleteFile, clearAllFiles } = useStorage()

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>(() =>
    storedFiles.map((fd) => {
      const file = new File([], fd.name, { type: 'text/csv', lastModified: fd.lastModified })
      Object.defineProperty(file, 'size', { value: fd.size })
      return { id: fd.id, file, status: fd.status, uploadedAt: fd.uploadedAt, data: fd.data, error: fd.error }
    }),
  )

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
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newFileNames = new Set(acceptedFiles.map((f) => f.name))
      const duplicateIds: string[] = []

      setUploadingFiles((prev) => {
        const duplicates = prev.filter((f) => newFileNames.has(f.file.name))
        duplicateIds.push(...duplicates.map((f) => f.id))
        return prev.filter((f) => !newFileNames.has(f.file.name))
      })

      for (const id of duplicateIds) {
        try {
          await deleteFile(id)
        } catch (error) {
          console.error('Failed to remove duplicate file from IndexedDB:', error)
        }
      }

      const newFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        status: 'uploading',
        uploadedAt: Date.now(),
      }))

      const rejectedAsUploading: UploadingFile[] = fileRejections.map(({ file, errors }) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        status: 'error' as const,
        uploadedAt: Date.now(),
        error: errors.map((e) => e.message).join(', '),
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles, ...rejectedAsUploading])

      for (const rejectedFile of rejectedAsUploading) {
        try {
          await storeFile({
            id: rejectedFile.id,
            name: rejectedFile.file.name,
            size: rejectedFile.file.size,
            lastModified: rejectedFile.file.lastModified,
            data: [],
            status: 'error',
            error: rejectedFile.error,
          })
        } catch (error) {
          console.error('Failed to store rejected file:', error)
        }
      }

      newFiles.forEach((f) => parseFile(f.id, f.file))
    },
    [parseFile, storeFile, deleteFile],
  )

  const removeFile = useCallback(
    async (fileId: string) => {
      setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
      try {
        await deleteFile(fileId)
      } catch (error) {
        console.error('Failed to remove file from IndexedDB:', error)
      }
    },
    [deleteFile],
  )

  const clearAll = useCallback(async () => {
    setUploadingFiles([])
    try {
      await clearAllFiles()
    } catch (error) {
      console.error('Failed to clear files from IndexedDB:', error)
    }
  }, [clearAllFiles])

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
    removeFile,
    clearAllFiles: clearAll,
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
