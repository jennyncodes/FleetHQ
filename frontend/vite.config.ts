import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward all /api/* calls to Flask during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output goes into Flask's static folder for production
    outDir: '../fleethq/static',
    emptyOutDir: true,
  },
})
