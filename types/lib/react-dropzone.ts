import type { FileWithPath } from 'react-dropzone'
import { z } from 'zod'

export const zRDFileWithPath = z.custom<FileWithPath>((val) => {
  return val instanceof File
})

export type RDFileWithPath = z.infer<typeof zRDFileWithPath>
