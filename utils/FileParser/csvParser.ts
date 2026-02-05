import Papa from 'papaparse'

export const parseCsvFile = (
  file: File,
  { onComplete, onError }: { onComplete: (data: unknown[]) => void; onError: (error: Error) => void },
) => {
  const parsedData: unknown[] = []

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    worker: true,
    step: (results) => {
      parsedData.push(results.data)
    },
    complete: () => {
      onComplete(parsedData)
    },
    error: (error) => {
      onError(new Error(error.message))
    },
  })
}
