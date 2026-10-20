import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One-line outcome shown in the work list and case-study header. */
      summary: z.string(),
      year: z.string(),
      role: z.string(),
      tools: z.array(z.string()),
      /** Short mono tags for the work list row. */
      tags: z.array(z.string()),
      status: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      order: z.number(),
      confidential: z.boolean().default(false),
    }),
});

export const collections = { projects };
