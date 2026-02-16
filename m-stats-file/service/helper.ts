import { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { RDZFileWithPath } from '@/types/lib/react-dropzone'

export const getStatsFileDefaults = (file: RDZFileWithPath): StatsFile => ({
  created: '',
  modified: '',
  id: '',
  hash: '',
  file,
  status: StatsFileStatus.PARSING,
  parserId: null,
  parsedContentRows: [],
  rawParseResult: null,
})

export const isError = (file: StatsFile) => {
  return file.status === StatsFileStatus.ERROR
}

export const isUnknown = (file: StatsFile) => {
  return file.status !== StatsFileStatus.ERROR && !file.parserId
}
