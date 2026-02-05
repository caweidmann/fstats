import { useLocalStorage } from 'usehooks-ts'

import type { LocalSettings } from '@/types'
import { MISC } from '@/common'

type SetLocalSetting = <K extends keyof LocalSettings>(key: K, value: LocalSettings[K]) => void

export const useLocalSettings = (): LocalSettings & { set: SetLocalSetting } => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[] | null>(MISC.LS_SELECTED_FILE_IDS_KEY, null)

  const set: SetLocalSetting = (key, value) => {
    switch (key) {
      case 'selectedFileIds':
        setSelectedFileIds(value as string[])
        break
      default:
        throw new Error(`Invalid local setting key: ${key}`)
    }
  }

  return {
    selectedFileIds,
    set,
  }
}
