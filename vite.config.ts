import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default {
  base: "",
  plugins: [vue()],
  build: {
    outDir: "docs",
  },
}
