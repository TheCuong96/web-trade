import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true // dùng để hiển thị nơi xử lý đoạn css đó ở file nào
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
