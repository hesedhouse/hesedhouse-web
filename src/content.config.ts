import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dynasty = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dynasty' }),
  schema: z.object({
    name: z.string(),
    hanja: z.string(),
    role: z.string(),
    team: z.string(),
    personality: z.string(),
    quote: z.string(),
    image: z.string(),
    order: z.number(),
  }),
});

export const collections = { dynasty };
