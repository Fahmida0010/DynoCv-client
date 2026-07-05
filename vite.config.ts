import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // এটি ব্রাউজারে 'process.env' এরর আসা চিরতরে বন্ধ করবে
    'process.env': {}
  }
})
