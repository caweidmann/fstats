import { useCallback } from 'react'

import { useStorage } from '@/components'
import { getParser, type ParserType } from '@/utils/FileParser'

export interface UseFileParserOptions {
  parserType: ParserType
  onComplete?: (fileId: string, data: unknown[], fileName: string, fileSize: number) => void
  onError?: (fileId: string, error: Error) => void
}

export const useFileParser = (options: UseFileParserOptions) => {
  const { parserType, onComplete, onError } = options
  const { storeFile } = useStorage()

  const parseFile = useCallback(
    (fileId: string, file: File) => {
      const parser = getParser(parserType)

      parser(file, {
        onComplete: async (data) => {
          try {
            await storeFile({
              id: fileId,
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              data,
              status: 'complete',
            })
          } catch (error) {
            console.error('Failed to store file in IndexedDB:', error)
          }

          onComplete?.(fileId, data, file.name, file.size)
        },
        onError: (error) => {
          onError?.(fileId, error)
        },
      })
    },
    [parserType, onComplete, onError, storeFile],
  )

  return { parseFile }
}
