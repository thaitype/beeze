import { PrettyLogger } from '@thaitype/core-utils';
import { run, command, boolean, type TypeOf, positional, string } from "@drizzle-team/brocli";
import { getConfig } from './internal/load-config';
import { version } from './version';

// console.log('Starting beeze process...');

// const config = await getConfig({
// }, new PrettyLogger(),);
// if (!config) {
//   throw new Error('Configuration not found. Please ensure beeze.config.js or package.json is set up correctly.');
// }

// console.log('Configuration loaded:', config);

// const echo = command({
//   name: "echo",
//   options: {
//     text: positional().desc("Text to echo").default("echo"),
//   },
//   handler: (opts) => {
//     console.log(opts.text);
//   },
// });

// run([echo], {
//   name: "beeze",
//   description: "Build tool for tiny Node.js serverless functions and minimal Docker images.",
//   globals: {},
//   version: "0.1.0",
// })


// --- Shared Options ---
const sharedOptions = {
  watch: boolean("watch")
    .alias("w")
    .desc("Enable watch mode (dev only)")
    .default(false),
};

// --- Dev Command ---
const dev = command({
  name: "dev",
  desc: "Run in development mode (with optional --watch)",
  options: sharedOptions,
  handler: (opts: TypeOf<typeof sharedOptions>) => {
    console.log("[beeze] dev mode");
    if (opts.watch) {
      console.log("Watching for changes...");
    } else {
      console.log("Building once in dev mode...");
    }
    // todo: invoke your dev build logic here
  },
});

// --- Build Command ---
const build = command({
  name: "build",
  desc: "Run a production build (minify, optimized)",
  options: {},
  handler: () => {
    console.log("[beeze] building for production...");
    // todo: invoke your production build logic here
  },
});

// --- Run CLI ---
run([dev, build], {
  name: "beeze",
  description: "🐝 Tiny builds that fly — Build tool for serverless functions and Docker images.",
  version,
  globals: {
    root: string('root')
      .desc('Set project root directory')
      .default(process.cwd()),
  },
  hook: (event, command, globals) => {
    if (event === 'before') {
      process.chdir(globals.root);
      console.log(`[beeze] Root directory set to: ${globals.root}`);
    }
  },
});


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
