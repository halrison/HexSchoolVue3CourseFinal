import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(
{
  plugins: [
    vue(),
  ],
  base:process.env.NODE_ENV==='production' ? '/HexSchoolVue3CourseFinal/' : '',
  build:{
    outDir:'docs'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
)
