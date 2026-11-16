import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['./tests/integration/setup.ts'],
    testTimeout: 20000,
    hookTimeout: 30000,
    fileParallelism: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
