import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // vite 5.2 暂只支持 sass legacy JS API，静默该弃用警告
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
});
