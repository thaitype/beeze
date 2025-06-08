import { loadConfig } from 'unconfig';
import path from 'node:path';
import { MARK_CHECK } from './constant.js';
import c from 'ansis';
import type { GlobalConfigOptions } from './types.js';
import { type ILogger, NoopLogger } from '@thaitype/core-utils';
import type { BeezeConfig } from '../config.js';

export const DEFAULT_CONFIG_NAME = 'beeze.config';
// Allow all JS/TS file extensions except JSON
export const DEFAULT_CONFIG_EXTENSIONS = ['mts', 'cts', 'ts', 'mjs', 'cjs', 'js'];

export function getMatchConfigFile(): string {
  return `${DEFAULT_CONFIG_NAME}.{${DEFAULT_CONFIG_EXTENSIONS.join(',')}}`;
}

export async function getConfig(
  options: GlobalConfigOptions,
  logger: ILogger = new NoopLogger()
): Promise<BeezeConfig | undefined> {
  const result = await loadConfig<BeezeConfig>({
    cwd: options.root,
    sources: [
      {
        files: options.config || DEFAULT_CONFIG_NAME,
        // Allow all JS/TS file extensions except JSON
        extensions: DEFAULT_CONFIG_EXTENSIONS,
      },
      {
        // Load JSON config file if it exists, read from field 'beeze' in package.json
        files: 'package',
        extensions: ['json'],
      },
    ],
    merge: false,
  });
  // Check if source from package.json exists
  if (result.sources.some(source => path.basename(source) === 'package.json')) {
    const packageJson = result.config as { beeze: BeezeConfig } | undefined;
    logger.log(c.green`${MARK_CHECK} Config loaded from package.json`);
    if (packageJson && packageJson.beeze) {
      logger.log(c.green`${MARK_CHECK} Config loaded from package.json field 'beeze'`);
      return packageJson.beeze;
    } else {
      logger.warn(c.yellow`No 'beeze' field found in package.json`);
      return undefined;
    }
  }
  if (result.sources.length) logger.log(c.green`${MARK_CHECK} Config loaded from ${result.sources.join(', ')}`);
  return result.config;
}
