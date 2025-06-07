import { PrettyLogger } from '@thaitype/core-utils';
import { beeze } from './lib';
import { getConfig } from './internal/load-config';

console.log('Starting beeze process...');

const config = await getConfig({
}, new PrettyLogger(),);
if (!config) {
  throw new Error('Configuration not found. Please ensure beeze.config.js or package.json is set up correctly.');
}

console.log('Configuration loaded:', config);

// const mode = (process.argv[2] || 'watch') as 'watch' | 'build';
// if (mode !== 'watch' && mode !== 'build') {
//   throw new Error('Invalid mode. Use "watch" or "build".');
// }

// const logger = new PrettyLogger();

// beeze({
//   esbuildOptions: {
//     entryPoints: ['server/main.ts'],
//     outfile: 'functions/dist/main.js',
//     external: ['@azure/functions-core'],
//   },
//   logger,
//   mode,
//   targetDir: 'functions', // here is where npm install apply and the new root package.json
//   watchDirectories: ['server', 'src'],
// });
