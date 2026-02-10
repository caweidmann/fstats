import { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { RDZFileWithPath } from '@/types/lib/react-dropzone'

export const getStatsFileDefaults = (file: RDZFileWithPath): StatsFile => ({
  created: '',
  modified: '',
  id: '',
  file,
  status: StatsFileStatus.PARSING,
  parserId: null,
  parsedContentRows: [],
  rawParseResult: null,
})
