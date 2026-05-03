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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'ip-license',
      'merch-guide',
      'popup-store',
      'distribution',
      'visual-creative',
      'global-trend',
      'cost-analysis',
      'legal-guide',
      'trend-ai',
      'editorial',
      'kpop-monthly',
    ]),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { dynasty, blog };
