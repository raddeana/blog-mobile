import { defineConfig } from "vitest/config";

// 独立于 vite.config.ts：避免加载 uni() 插件，测试只做纯 Node 环境的样式编译断言
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
  },
});
