// import type { Equal, Expect } from '@type-challenges/utils';
import z from 'zod';

export const beezeConfigSchema = z.object({
  externalDependencies: z.record(z.string(), z.union([z.literal('external'), z.literal('install')])).optional(),
  outfile: z.string().optional(),
  outdir: z.string().optional(),
});

// type _Check = Expect<Equal<z.infer<typeof beezeConfigSchema>, BeezeConfig>>;
