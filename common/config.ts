import packageJson from '../package.json'

export const CONFIG = {
  APP_VERSION: packageJson.version,
  ENABLE_CONSOLE_LOGGING: process.env.NODE_ENV === 'development',
  TAN_STACK_QUERY_DEVTOOLS: true,
} as const
