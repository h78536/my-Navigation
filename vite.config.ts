import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 确保资源路径为相对路径，适配 GitHub Pages
  define: {
    // 适配 Gemini API 环境变量
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY'
  },
  server: {
    port: 3000
  }
})