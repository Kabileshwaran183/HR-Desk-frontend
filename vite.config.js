import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()] ,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf-worker": ["pdfjs-dist/build/pdf.worker.min"],
        },
      },
    },
  }, 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})


