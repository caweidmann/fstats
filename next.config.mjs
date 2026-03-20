import { withSerwist } from '@serwist/turbopack'

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false,
  },
  webpack: (config) => {
    // Ignore _data directory during builds
    config.module.rules.push({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /_data/,
    })
    return config
  },
}

module.exports = withSerwist(nextConfig)
