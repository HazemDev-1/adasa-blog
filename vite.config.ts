/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    // Some machines set NODE_ENV=production globally; React's test helpers need the dev build.
    env: { NODE_ENV: 'test' },
  },
})
