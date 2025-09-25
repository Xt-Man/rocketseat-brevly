import { defineConfig } from 'tsup';

export default defineConfig({
  // ... other tsup configurations
  format: ['esm'],
  clean: true,
  esbuildOptions(options) {
    options.loader = {
      '.sql': 'file',
    };
  },
});