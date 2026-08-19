import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Content lives as MDX in the repo (git is the CMS). Keystatic edits these same
// files; Astro reads them here. Frontmatter is Zod-validated so a bad entry
// fails the build instead of shipping broken. Fields Keystatic can leave empty
// use `.nullish()` because it writes `null` rather than omitting them.

// One stream, discriminated by `kind`. Essays and notes are aimed at a stranger
// and are evergreen; logs record what changed in a product and are ephemeral.
// The front page merges all three by date — that merge is the whole point of
// keeping them in one collection rather than two.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['essay', 'note', 'log']).default('note'),
    /** Slug of the product a log entry belongs to; null for essays and notes. */
    project: z.string().nullish(),
    tags: z.array(z.string()).default([]),
    cover: z.string().nullish(),
    draft: z.boolean().default(false),
  }),
});

// Things I've shipped. `kind` keeps the page honest — a CLI utility is a tool,
// not a product — and only live products appear in the header's NOW strip.
const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(), // first shipped
    order: z.number().default(0), // ascending; lower sorts first
    kind: z.enum(['product', 'tool']).default('product'),
    status: z.enum(['live', 'wip', 'archived']).default('live'),
    /** One-line positioning, shown under the title on /products. */
    tagline: z.string().nullish(),
    stack: z.array(z.string()).default([]),
    url: z.string().url().nullish(),
    repo: z.string().url().nullish(),
    cover: z.string().nullish(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, products };
