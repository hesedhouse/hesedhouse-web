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
      'ip-trend',
      'goods-culture',
      'popup-retail',
      'market-insight',
      'brand-story',
      'k-content-global',
      'fan-economy',
      'biz-legal',
      'ai-biz',
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

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['ip', 'merch', 'popup', 'distribution', 'vs', 'ai']),
    client: z.string(),
    description: z.string().default(''),
    year: z.string(),
    tag: z.string().default(''),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { dynasty, blog, portfolio };
