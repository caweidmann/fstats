import { parse } from 'papaparse'

import type { PPRawParseResult } from '@/types'

export const parseRaw = async (file: File): Promise<PPRawParseResult> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: false,
      skipEmptyLines: 'greedy',
      encoding: 'utf-8',
      worker: true,
      complete: (results) => {
        resolve(results as PPRawParseResult)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
