import { config, fields, collection } from '@keystatic/core';

// ── Storage ────────────────────────────────────────────────────────────────
// Dev  → local mode: the /keystatic admin edits your working tree directly, no
//        auth. Publishing = save + `git push`.
// Prod → GitHub mode: /keystatic is live and gated by GitHub OAuth; only users
//        with WRITE access to the repo can commit. Set the repo below and the
//        KEYSTATIC_GITHUB_* + KEYSTATIC_SECRET env vars (see .env.example).
//        Optionally put Cloudflare Access in front of /keystatic* as well.
const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : ({
      kind: 'github',
      repo: { owner: 'wayleem', name: 'wayleem.github.io' },
    } as const);

const tags = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  itemLabel: (props) => props.value,
});

export default config({
  storage,
  ui: { brand: { name: 'wayleem.com' } },
  collections: {
    work: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/work/*', // one file per entry: src/content/work/<slug>.mdx
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        featured: fields.checkbox({ label: 'Feature on canvas', defaultValue: false }),
        order: fields.integer({ label: 'Canvas order', defaultValue: 0 }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Project', value: 'project' },
            { label: 'Job (timeline)', value: 'job' },
          ],
          defaultValue: 'project',
        }),
        org: fields.text({ label: 'Org / company (jobs)' }),
        period: fields.text({ label: 'Period, e.g. 2024 – now (jobs)' }),
        tags,
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/covers/work',
          publicPath: '/covers/work/',
        }),
        repo: fields.url({ label: 'Repo URL' }),
        demo: fields.url({ label: 'Live demo URL' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Case study', extension: 'mdx' }),
      },
    }),
    writing: collection({
      label: 'Writing',
      slugField: 'title',
      path: 'src/content/writing/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        featured: fields.checkbox({ label: 'Pin to canvas', defaultValue: false }),
        tags,
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/covers/writing',
          publicPath: '/covers/writing/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Post', extension: 'mdx' }),
      },
    }),
  },
});
