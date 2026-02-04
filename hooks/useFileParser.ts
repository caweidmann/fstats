import { useCallback } from 'react'

import { parseCSVFile, type CSVParserOptions } from '@/lib/parsers/csvParser'
import { indexedDBService } from '@/lib/storage/indexedDB'

export type FileParserType = 'csv' | 'json' | 'excel'

export interface UseFileParserOptions {
  parserType: FileParserType
  onComplete?: (fileId: string, data: unknown[], fileName: string, fileSize: number) => void
  onError?: (fileId: string, error: Error) => void
}

export const useFileParser = (options: UseFileParserOptions) => {
  const { parserType, onComplete, onError } = options

  const parseFile = useCallback(
    (fileId: string, file: File) => {
      const parserOptions: CSVParserOptions = {
        onComplete: async (data) => {
          try {
            await indexedDBService.init()
            await indexedDBService.storeFile(fileId, file.name, file.size, file.lastModified, data, 'complete')
          } catch (error) {
            console.error('Failed to store file in IndexedDB:', error)
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
          throw new Error('JSON parser not implemented')
        case 'excel':
          throw new Error('Excel parser not implemented')
        default:
          throw new Error(`Unknown parser type: ${parserType}`)
      }
    },
    [parserType, onComplete, onError],
  )

  return { parseFile }
}
