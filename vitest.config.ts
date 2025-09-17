import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{js,ts,tsx}"],
      exclude: ["src/**/*.{test,spec}.{js,ts,tsx}", "src/test-setup.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
      "@repo/utils": resolve(__dirname, "../../packages/utils/src"),
    },
  },
});
