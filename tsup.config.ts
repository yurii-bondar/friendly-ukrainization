import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    // Cleaning is done once up front by the `prebuild` script — tsup runs
    // this multi-entry config's builds concurrently, so a `clean: true`
    // here could race and wipe the other entry's freshly written output.
    clean: false,
    target: 'es2020',
    splitting: false,
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    dts: false,
    sourcemap: false,
    clean: false,
    target: 'es2020',
    splitting: false,
    banner: { js: '#!/usr/bin/env node' },
  },
]);
