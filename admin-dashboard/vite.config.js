import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Sempre que o React pedir algo com '/tickets', o Vite desvia para o Java em segredo
      '/tickets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})