import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path" // 1. Path import karo

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})