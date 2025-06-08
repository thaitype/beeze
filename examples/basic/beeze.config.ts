import { defineConfig } from 'beeze';
// import { BeezeConfig } from '../../packages/beeze/dist/dts/BeezeConfig';

export default defineConfig({
  externalDependencies: {
    express: 'install',
    'beeze-plugin-logger': 'external',
  },
  outfile: 'dist/index.js',
  outdir: 'dist',
});