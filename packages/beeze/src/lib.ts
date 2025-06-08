import esbuild from 'esbuild';
import chokidar from 'chokidar';
import path from 'node:path';
import fs from 'fs/promises';
import z from 'zod';
import { execa } from 'execa';
import { type ILogger, ConsoleLogger } from '@thaitype/core-utils';
import { beezeConfigSchema } from './BeezeConfig.js';
import type { BeezeConfig } from './config.js';

export interface BeezeGlobalConfig extends BeezeConfig, StartBeezeOptions {}

export interface StartBeezeOptions {
  esbuildOptions: esbuild.BuildOptions;
  root?: string;
  mode?: 'dev' | 'build';
  watch?: boolean;
  verbose?: boolean;
  targetDir?: string;
  watchDirectories?: string[];
  logger?: ILogger;
}

const defaultOptions: esbuild.BuildOptions = {
  bundle: true,
  platform: 'node',
  sourcemap: true,
  minify: true,
  format: 'cjs',
  target: ['node22'],
};

export async function watch(options: StartBeezeOptions, buildCallback: () => Promise<void>) {
  if (!options.watchDirectories || options.watchDirectories.length === 0) {
    throw new Error('No directories specified to watch.');
  }
  const watchPaths = options.watchDirectories.map(dir => path.join(options.root ?? '', dir));
  options.logger?.log(`Watching directories: ${watchPaths.join(', ')}`);
  const watcher = chokidar.watch(watchPaths);

  watcher.on('change', path => {
    options.logger?.log(`📄 File changed: ${path}`);
    buildCallback()
      .then(() => options.logger?.log('Build completed successfully.'))
      .catch(err => {
        console.error('Error during build:', err);
      });
  });
}

export async function build(options: StartBeezeOptions) {
  const { verbose } = options;

  // Build configuration
  const config: esbuild.BuildOptions = {
    ...defaultOptions,
    ...options.esbuildOptions,
  };

  if (verbose) {
    options.logger?.log('beeze Configuration: ' + JSON.stringify(config, null, 2));
  }

  await esbuild.build({
    ...config,
  });
}

export const packageJsonConfigSchema = z.object({
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  beeze: beezeConfigSchema.optional(),
});

interface ExternalDependency {
  name: string;
  version: string;
}

function parseExternalDependencies(pkgData: unknown): ExternalDependency[] {
  const parsed = packageJsonConfigSchema.parse(pkgData);

  const dependencies = {
    ...(parsed.dependencies ?? {}),
    ...(parsed.devDependencies ?? {}),
  };

  const externalDeps = parsed.beeze?.externalDependencies ?? {};
  const installDeps: ExternalDependency[] = [];

  for (const [pkg, mode] of Object.entries(externalDeps)) {
    if (mode === 'install') {
      const version = dependencies[pkg];
      if (!version) {
        throw new Error(`📦 Missing version for package "${pkg}" in dependencies or devDependencies.`);
      }
      installDeps.push({ name: pkg, version });
    }
  }

  return installDeps;
}

async function writePackageJson({
  cwd,
  targetDir,
  outfile,
  outdir,
  logger,
  verbose,
}: {
  cwd: string;
  targetDir: string;
  outfile?: string;
  outdir?: string;
  logger?: ILogger;
  verbose?: boolean;
}) {
  const outputPath = outfile
    ? outfile
    : outdir
      ? path.join(outdir, 'main.js') // 👈 assume entry is main.js
      : null;

  if (!outputPath) {
    throw new Error(`Missing "outfile" or "outdir" in esbuildOptions`);
  }

  const mainRelative = path.relative(targetDir, outputPath);
  const newPkg = { main: mainRelative };
  const newPkgPath = path.join(cwd, targetDir, 'package.json');
  await fs.writeFile(newPkgPath, JSON.stringify(newPkg, null, 2));

  if (verbose) {
    logger?.log(`📝 Created package.json at ${newPkgPath}`);
  }
}

async function installPackages({
  deps,
  cwd,
  targetDir,
  verbose,
  logger,
}: {
  deps: ExternalDependency[];
  cwd: string;
  targetDir: string;
  verbose?: boolean;
  logger?: ILogger;
}) {
  if (deps.length === 0) {
    if (verbose) logger?.log('📦 No runtime dependencies to install.');
    return;
  }

  logger?.log(`📦 Installing runtime dependencies...`);
  for (const { name, version } of deps) {
    const full = `${name}@${version}`;
    logger?.log(`➡️  Installing ${full} in ${targetDir}`);
    try {
      await execa('npm', ['install', full], {
        cwd: path.resolve(cwd, targetDir),
        stdio: verbose ? 'inherit' : 'pipe',
      });
      logger?.log(`✅ Installed ${full}`);
    } catch (err) {
      console.error(`❌ Failed to install ${full}:`, err);
      throw err;
    }
  }
}

export async function handleExternalDependencies(option: BeezeGlobalConfig) {
  const cwd = option.root ?? process.cwd();
  const targetDir = option.targetDir;
  if (!targetDir) return;

  const pkgJsonPath = path.join(cwd, 'package.json');
  const rawPkg = await fs.readFile(pkgJsonPath, 'utf-8');
  const pkgData = JSON.parse(rawPkg);

  const installDeps = parseExternalDependencies(pkgData);

  await writePackageJson({
    cwd,
    targetDir,
    outfile: option.outfile,
    outdir: option.outdir,
    verbose: option.verbose,
  });

  await installPackages({
    deps: installDeps,
    cwd,
    targetDir,
    verbose: option.verbose,
  });
}

export async function startBeeze(option: StartBeezeOptions) {
  const { mode = 'build', logger = new ConsoleLogger() } = option;

  // const config = await getConfig({
  // }, new PrettyLogger(),);
  // if (!config) {
  //   throw new Error('Configuration not found. Please ensure beeze.config.js or package.json is set up correctly.');
  // }

  // console.log('Configuration loaded:', config);

  await handleExternalDependencies(option);

  if (mode === 'dev') {
    if (option.watch) {
      const watchDirectories = option.watchDirectories || ['src'];
      await watch(
        {
          ...option,
          watchDirectories,
        },
        () => build(option)
      );
    } else {
      logger.log('Running in development mode');
      await build(option);
    }
  } else {
    if (option.watch) {
      logger.warn('Watch mode is not supported in build mode. Running a single build.');
    }
    await build(option);
  }
}
