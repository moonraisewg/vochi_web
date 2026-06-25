import { defineConfig } from "vitest/config";

// Local config so vitest runs this package's tests in isolation instead of
// walking up and picking up the desktop app's root config (which references a
// setup file that doesn't exist here).
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
