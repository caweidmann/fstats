import { MISC } from '@/common'

export const parseSelectedFileIds = (): string[] | null => {
  const raw = localStorage.getItem(MISC.LS_SELECTED_FILE_IDS_KEY)

  if (raw === null) {
    return null
  }

  try {
    return JSON.parse(raw) as string[]
  } catch {
    return null
  }
}
