import { parse } from 'papaparse'
import type { FileWithPath } from 'react-dropzone'

import type { FileData } from '@/types'
import { SupportedFormats } from '@/types-enums'

import { isEqual } from '../Misc'

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
  let parsedType: FileData['parsedType'] = SupportedFormats.UNKNOWN
  const parsedContent = await parseRaw(file.file)

  if (isEqual(parsedContent.data[0], capitecHeaders)) {
    parsedType = SupportedFormats.CAPITEC
  }

  return {
    ...file,
    status: 'parsed',
    parsedContent,
    parsedType,
  }
}

export const parseRaw = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      // header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        console.log('parsing complete:', results)
        resolve(results)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
