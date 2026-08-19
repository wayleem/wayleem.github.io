import { config, fields, collection } from '@keystatic/core';

// ── Storage ────────────────────────────────────────────────────────────────
// Dev  → local mode: the /keystatic admin edits your working tree directly, no
//        auth. Publishing = save + `git push`.
// Prod → GitHub mode: /keystatic is live and gated by GitHub OAuth; only users
//        with WRITE access to the repo can commit. Set the repo below and the
//        KEYSTATIC_GITHUB_* + KEYSTATIC_SECRET env vars (see .env.example).
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
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        kind: fields.select({
          label: 'Kind',
          description:
            'Essay/note = aimed at a stranger, evergreen. Log = what changed in a product.',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Note', value: 'note' },
            { label: 'Log', value: 'log' },
          ],
          defaultValue: 'note',
        }),
        project: fields.text({
          label: 'Product slug (log entries only)',
          description: 'e.g. skadooble — must match a file in src/content/products.',
        }),
        tags,
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/covers/posts',
          publicPath: '/covers/posts/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Post', extension: 'mdx' }),
      },
    }),
    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        tagline: fields.text({ label: 'Tagline', description: 'One line, shown in the NOW strip.' }),
        date: fields.date({ label: 'First shipped', defaultValue: { kind: 'today' } }),
        order: fields.integer({ label: 'Order (ascending)', defaultValue: 0 }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Tool', value: 'tool' },
          ],
          defaultValue: 'product',
        }),
        status: fields.select({
          label: 'Status',
          description: 'Only live products appear in the NOW strip.',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'WIP', value: 'wip' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'live',
        }),
        stack: fields.array(fields.text({ label: 'Technology' }), {
          label: 'Stack',
          itemLabel: (props) => props.value,
        }),
        url: fields.url({ label: 'Live URL' }),
        repo: fields.url({ label: 'Repo URL' }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/covers/products',
          publicPath: '/covers/products/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Case study', extension: 'mdx' }),
      },
    }),
  },
});
