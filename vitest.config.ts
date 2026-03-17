import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "apps/admin-spa/vitest.config.ts",
      "apps/portal-spa/vitest.config.ts",
      "packages/shared-ui/vitest.config.ts",
      "packages/shared-utils/vitest.config.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["apps/*/src/**/*.{ts,tsx}", "packages/*/src/**/*.{ts,tsx}"],
      exclude: [
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
        "**/main.tsx",
        "**/dist/**",
        "**/node_modules/**",
        "e2e/**",
        "apps/main-site/**",
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 75,
        statements: 80,
      },
    },
  },
});
