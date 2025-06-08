import { Equal, Expect } from "@type-challenges/utils";
import z from "zod";

export interface BeezeConfig {
  /**
   * External dependencies configuration.
   * This allows you to specify how external dependencies should be handled.
   * - "external": The dependency is expected to be available externally (e.g., in the global scope).
   * - "install": The dependency wiil be installed via npm.
   */
  externalDependencies?: Record<string, "external" | "install"> | undefined;

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

export const beezeConfigSchema = z
  .object({
    externalDependencies: z.record(z.string(), z.union([z.literal('external'), z.literal('install')])).optional(),
    outfile: z.string().optional(),
    outdir: z.string().optional(),
  });


type _Check = Expect<Equal<z.infer<typeof beezeConfigSchema>, BeezeConfig>>;
