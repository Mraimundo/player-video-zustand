import path from "node:path";
import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const baseConfig = defineConfig({
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  server: { port: 3000 },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});

const unitConfig = defineConfig({
  test: {
    name: "unit",
    dir: "src",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});

export default mergeConfig(baseConfig, {
  test: { projects: [unitConfig] },
});
