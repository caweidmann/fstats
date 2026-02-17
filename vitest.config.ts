import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['tree'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
