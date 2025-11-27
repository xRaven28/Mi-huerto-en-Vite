/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/assets/components"),
      "@pages": path.resolve(__dirname, "./src/assets/pages"),
      "@services": path.resolve(__dirname, "./src/assets/services"),
      "@types": path.resolve(__dirname, "./src/assets/types"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    isolate: false,
    deps: {
      interopDefault: true,
    },
  },
});
