import { MISC } from '@/common'

export const parseSelectedFileIds = (): string[] => {
  const raw = window.localStorage.getItem(MISC.LS_SELECTED_FILE_IDS_KEY)

  if (raw === null) {
    return []
  }

  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}
