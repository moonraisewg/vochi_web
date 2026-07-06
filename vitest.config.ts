import { defineConfig } from "vitest/config";

// Local config so vitest runs this package's tests in isolation instead of
// walking up and picking up the desktop app's root config (which references a
// setup file that doesn't exist here).
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // The *-integration.test.ts files share ONE live Postgres DB and TRUNCATE
    // it in beforeEach. Vitest's default file parallelism runs test files
    // concurrently, so two integration files interleave their truncates and
    // randomly wipe each other's fixtures mid-test (flaky, not a real bug in
    // the tested code — confirmed by each file passing 100% in isolation).
    fileParallelism: false,
  },
});
