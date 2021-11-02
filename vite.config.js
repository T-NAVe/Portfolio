import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dist/',
  build: {
    chunkSizeWarningLimit:1500
  }
})