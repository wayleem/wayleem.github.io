import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Content lives as MDX in the repo (git is the CMS). Keystatic edits these same
// files; Astro reads them here. Frontmatter is Zod-validated so a bad entry
// fails the build instead of shipping broken. Fields Keystatic can leave empty
// use `.nullish()` because it writes `null` rather than omitting them.

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    order: z.number().default(0), // burst order on the canvas
    tags: z.array(z.string()).default([]),
    cover: z.string().nullish(), // public path, e.g. /covers/work/foo.png
    repo: z.string().url().nullish(),
    demo: z.string().url().nullish(),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().default(false), // pinned to the canvas burst
    tags: z.array(z.string()).default([]),
    cover: z.string().nullish(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, writing };
