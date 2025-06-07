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

import { run, command, positional } from "@drizzle-team/brocli";

const echo = command({
  name: "echo",
  options: {
    text: positional().desc("Text to echo").default("echo"),
  },
  handler: (opts) => {
    console.log(opts.text);
  },
});

run([echo])

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
