// TODO: Investigate if this library/package can be converted to client only

export const setItem = (key: string, value: unknown, options?: { dispatch?: boolean }): void => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))

  // We need `dispatchEvent()` so that the useLocalStorage hook will detect changes
  // to localStorage items that have been set with this utility.
  if (options?.dispatch) {
    window.dispatchEvent(new Event('local-storage'))
  }
}

export const getItem = (key: string): unknown => {
  if (typeof window === 'undefined') {
    return null
  }
  const value = window.localStorage.getItem(key)
  try {
    return value ? JSON.parse(value) : null
  } catch (err) {
    console.warn(`Failed reading localStorage key "${key}" with value "${value}":`, err)
    return null
  }
}

export const removeItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(key)
}
