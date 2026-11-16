import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// /api/libros -> http://127.0.0.1:8000/libros (evita instalar CORS en Django)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
