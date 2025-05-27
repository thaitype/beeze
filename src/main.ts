import { upbuild } from "./lib";

const mode = (process.argv[2] || 'watch') as 'watch' | 'build';
if (mode !== 'watch' && mode !== 'build') {
  throw new Error('Invalid mode. Use "watch" or "build".');
}

upbuild({
  esbuildOptions: {
    entryPoints: ['server/main.ts'],
    outfile: 'functions/dist/main.js',
    external: ['@azure/functions-core'],
  },
  mode,
  targetDir: 'functions', // here is where npm install apply and the new root package.json
  watchDirectories: ['server', 'src'],
});