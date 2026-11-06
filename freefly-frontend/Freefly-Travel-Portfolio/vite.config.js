import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards any /api/* request from the Vite dev server to FastAPI,
    // so the frontend can just call fetch('/api/destinations') without
    // hardcoding the backend host/port. Backend CORS (from Step 2) still
    // covers the case of hitting the API directly, e.g. via Swagger.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
