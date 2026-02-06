import { parse } from 'papaparse'
import type { FileWithPath } from 'react-dropzone'

import type { FileData } from '@/types'
import { isEqual } from '@/utils/Misc'

const capitecHeaders = [
  'Nr',
  'Account',
  'Posting Date',
  'Transaction Date',
  'Description',
  'Original Description',
  'Parent Category',
  'Category',
  'Money In',
  'Money Out',
  'Fee',
  'Balance',
]

export const parseFiles = async (files: FileData[]): Promise<FileData[]> => {
  const parsedFiles = await Promise.all(files.map(parseFile))
  return parsedFiles
}

export const parseFile = async (file: FileData): Promise<FileData> => {
  let parsedType: FileData['parsedType'] = 'unknown'
  const parsedContent = await parseRaw(file.file)

  if (isEqual(parsedContent.data[0], capitecHeaders)) {
    parsedType = 'capitec'
  }

  return {
    ...file,
    status: 'parsed',
    parsedContent,
    parsedType,
  }
}

export const parseRaw = async (file: File | FileWithPath): Promise<any> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      // header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results, ifile) => {
        console.log('parsing complete:', { file: ifile, results })
        resolve(results)
      },
      error: (err, ifile) => {
        console.error('parsing error:', { file: ifile, err })
        reject(err)
      },
    })
  })
}
