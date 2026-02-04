// Add new settings here. Types are inferred from the defaults.
const SETTING_DEFS = {
  persist: { key: 'fstats-persist', default: false },
}

type SettingDefs = typeof SETTING_DEFS
export type SettingKey = keyof SettingDefs
export type Settings = { [K in SettingKey]: SettingDefs[K]['default'] }

const parse = <K extends SettingKey>(key: K, raw: string): Settings[K] => {
  const def = SETTING_DEFS[key].default
  let value: unknown = raw
  if (typeof def === 'boolean') value = raw === 'true'
  else if (typeof def === 'number') value = Number(raw)
  return value as Settings[K]
}

export const readSetting = <K extends SettingKey>(key: K): Settings[K] => {
  if (typeof window === 'undefined') return SETTING_DEFS[key].default as Settings[K]
  const raw = localStorage.getItem(SETTING_DEFS[key].key)
  if (raw === null) return SETTING_DEFS[key].default as Settings[K]
  return parse(key, raw)
}

export const writeSetting = <K extends SettingKey>(key: K, value: Settings[K]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTING_DEFS[key].key, String(value))
  }
}

export const readAllSettings = (): Settings =>
  Object.fromEntries(Object.keys(SETTING_DEFS).map((k) => [k, readSetting(k as SettingKey)])) as Settings
