import packageJson from '../package.json'

export const CONFIG = {
  APP_VERSION: packageJson.version,
  ENABLE_CONSOLE_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_TANSTACK_QUERY_DEVTOOLS: false,
  ENABLE_ANALYTICS: true,
  ENABLE_SPEED_INSIGHTS: false,
} as const
