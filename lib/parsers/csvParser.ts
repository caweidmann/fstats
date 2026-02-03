import Papa from 'papaparse'

export type ParseProgressCallback = (progress: number) => void
export type ParseCompleteCallback = (data: unknown[], results: Papa.ParseResult<unknown>) => void
export type ParseErrorCallback = (error: Error) => void

export interface CSVParserOptions {
  onProgress?: ParseProgressCallback
  onComplete?: ParseCompleteCallback
  onError?: ParseErrorCallback
}

export const parseCSVFile = (file: File, options: CSVParserOptions = {}) => {
  const { onProgress, onComplete, onError } = options

  let totalRows = 0
  let processedRows = 0
  const parsedData: unknown[] = []

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    worker: true,
    step: (results) => {
      totalRows += 1
      processedRows += 1
      parsedData.push(results.data)

      if (onProgress) {
        const progress = Math.min((processedRows / Math.max(totalRows, 1)) * 100, 99)
        onProgress(progress)
      }
    },
    complete: (results) => {
      if (onProgress) {
        onProgress(100)
      }

      const finalResults = {
        ...results,
        data: parsedData,
      }
      console.log('parsedData', parsedData)
      console.log('finalResults', finalResults)

      if (onComplete) {
        onComplete(parsedData, finalResults)
      }
    },
    error: (error) => {
      if (onError) {
        onError(new Error(error.message))
      }
    },
  })
}
