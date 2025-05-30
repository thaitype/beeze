import { PrettyLogger } from '@thaitype/core-utils';
import { upbuild } from './lib';

console.log('Starting upbuild process...');

// const mode = (process.argv[2] || 'watch') as 'watch' | 'build';
// if (mode !== 'watch' && mode !== 'build') {
//   throw new Error('Invalid mode. Use "watch" or "build".');
// }

// const logger = new PrettyLogger();

// upbuild({
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
