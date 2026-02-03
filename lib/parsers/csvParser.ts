import Papa from 'papaparse'

export type ParseCompleteCallback = (data: unknown[], results: Papa.ParseResult<unknown>) => void
export type ParseErrorCallback = (error: Error) => void

export interface CSVParserOptions {
  onComplete?: ParseCompleteCallback
  onError?: ParseErrorCallback
}

export const parseCSVFile = (file: File, options: CSVParserOptions = {}) => {
  const { onComplete, onError } = options

  const parsedData: unknown[] = []

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    worker: true,
    step: (results) => {
      parsedData.push(results.data)
    },
    complete: (results) => {
      if (onComplete) {
        onComplete(parsedData, { ...results, data: parsedData })
      }
    },
    error: (error) => {
      if (onError) {
        onError(new Error(error.message))
      }
    },
  })
}
