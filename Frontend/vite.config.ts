import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      
      '/cred': {
        target: 'http://localhost:8201',
        changeOrigin: true,
      },
      
      '/healthz': {
        target: 'http://localhost:8201',
        changeOrigin: true,
      },
    },
  },
})
