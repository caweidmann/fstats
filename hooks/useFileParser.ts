import { useCallback } from 'react'

import { parseCSVFile, type CSVParserOptions } from '@/lib/parsers/csvParser'
import { indexedDBService } from '@/lib/storage/indexedDB'

export type FileParserType = 'csv' | 'json' | 'excel' // Add more types as needed

export interface UseFileParserOptions {
  parserType: FileParserType
  onProgress?: (fileId: string, progress: number) => void
  onComplete?: (fileId: string, data: unknown[], fileName: string, fileSize: number) => void
  onError?: (fileId: string, error: Error) => void
  storeInIndexedDB?: boolean
}

export const useFileParser = (options: UseFileParserOptions) => {
  const { parserType, onProgress, onComplete, onError, storeInIndexedDB = true } = options

  const parseFile = useCallback(
    (fileId: string, file: File) => {
      const parserOptions: CSVParserOptions = {
        onProgress: (progress) => {
          if (onProgress) {
            onProgress(fileId, progress)
          }
        },
        onComplete: async (data) => {
          if (storeInIndexedDB) {
            try {
              await indexedDBService.storeFile(fileId, file.name, file.size, data)
            } catch (error) {
              console.error('Failed to store file in IndexedDB:', error)
            }
          }

          if (onComplete) {
            onComplete(fileId, data, file.name, file.size)
          }
        },
        onError: (error) => {
          if (onError) {
            onError(fileId, error)
          }
        },
      }

      switch (parserType) {
        case 'csv':
          parseCSVFile(file, parserOptions)
          break
        case 'json':
          // TODO: Implement JSON parser
          throw new Error('JSON parser not implemented yet')
        case 'excel':
          // TODO: Implement Excel parser
          throw new Error('Excel parser not implemented yet')
        default:
          throw new Error(`Unknown parser type: ${parserType}`)
      }
    },
    [parserType, onProgress, onComplete, onError, storeInIndexedDB],
  )

  return { parseFile }
}
