import { useLocalStorage } from 'usehooks-ts'

import type { LocalSettings } from '@/types'
import { MISC } from '@/common'

type SetLocalSetting = <K extends keyof LocalSettings>(key: K, value: LocalSettings[K]) => void

type UseLocalSettingsReturn = LocalSettings & { set: SetLocalSetting }

export const useLocalSettings = (): UseLocalSettingsReturn => {
  const [selectedFileIds, setSelectedFileIds] = useLocalStorage<string[]>(MISC.LS_SELECTED_FILE_IDS_KEY, [])

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
