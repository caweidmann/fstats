import { useCallback } from 'react'

import { parseCSVFile, type CSVParserOptions } from '@/lib/parsers/csvParser'

export type FileParserType = 'csv' | 'json' | 'excel' // Add more types as needed

export interface UseFileParserOptions {
  parserType: FileParserType
  onProgress?: (fileId: string, progress: number) => void
  onComplete?: (fileId: string, data: unknown[]) => void
  onError?: (fileId: string, error: Error) => void
  storeInSessionStorage?: boolean
}

export const useFileParser = (options: UseFileParserOptions) => {
  const { parserType, onProgress, onComplete, onError, storeInSessionStorage = true } = options

  const parseFile = useCallback(
    (fileId: string, file: File) => {
      const parserOptions: CSVParserOptions = {
        onProgress: (progress) => {
          if (onProgress) {
            onProgress(fileId, progress)
          }
        },
        onComplete: (data) => {
          if (storeInSessionStorage) {
            try {
              sessionStorage.setItem(`file_${fileId}`, JSON.stringify(data))
            } catch (error) {
              console.error('Failed to store file in session storage:', error)
            }
          }

          if (onComplete) {
            onComplete(fileId, data)
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
    [parserType, onProgress, onComplete, onError, storeInSessionStorage],
  )

  return { parseFile }
}
