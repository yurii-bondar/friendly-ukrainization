import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      // src/data/**: static tables, not logic. src/cli.ts: a thin
      // process.argv/console/exit shim around the fully-tested cli-runner.ts.
      exclude: ['src/data/**', 'src/cli.ts'],
      thresholds: {
        statements: 90,
        lines: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
});
