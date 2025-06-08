// import type { BeezeConfig } from './BeezeConfig.js';

export interface BeezeConfig {
  /**
   * External dependencies configuration.
   * This allows you to specify how external dependencies should be handled.
   * - "external": The dependency is expected to be available externally (e.g., in the global scope).
   * - "install": The dependency wiil be installed via npm.
   */
  externalDependencies?: Record<string, 'external' | 'install'> | undefined;

  /**
   * Output file for the build.
   */
  outfile?: string; // Output file for the build
  /**
   * Target directory for the build.
   * This is where the build output will be placed.
   */
  outdir?: string;
}

export function defineConfig(config: BeezeConfig): BeezeConfig {
  return config;
}
