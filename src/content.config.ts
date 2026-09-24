import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    category: z.enum(['technology', 'note', 'health', 'lifes', 'projects', 'literature', 'philosophy', 'misc']),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    year: z.string().optional(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    demo: z.string().optional(),
    repo: z.string().url().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    category: z.enum(['engineering', 'studio']).default('engineering'),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, projects };