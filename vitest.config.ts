import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    bail: 0,
    environment: 'node',
    include: ['__tests__/**/*.spec.ts'],
    reporters: ['default', 'basic', 'html'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/domain/**/*.ts',
        'src/**/{init-app,main}.ts',
        'src/{middlewares}/*.ts',
        'src/{tools,entities,errors,config}/*.ts',
        'src/services/index.ts',
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
