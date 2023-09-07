import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../API/wwwroot',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
})