import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,  // Changed to a different port
    host: '0.0.0.0',  // Allow external access
    strictPort: false,  // Try next available port if 3000 is in use
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false
  },
  base: '/'
})
