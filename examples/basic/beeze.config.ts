import { defineConfig } from 'beeze';


export default defineConfig({
  externalDependencies: {
    express: 'install',
    'beeze-plugin-logger': 'external',
  },
  outfile: 'dist/index.js',
  outdir: 'dist',
});