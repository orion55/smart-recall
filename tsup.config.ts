import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  platform: 'node',
  target: 'es2022',
  splitting: false,
  sourcemap: false,
  clean: false,
  treeshake: false,
  minify: true,
  skipNodeModulesBundle: false,
  external: [],
  noExternal: [/.*/],
});
