// Build-time link previews, one PNG per post and product, written straight into
// dist/og/. Deliberately NOT an Astro endpoint: resvg ships a native binary that
// can't be bundled into a Cloudflare Worker, and these are plain static assets
// with no reason to touch the runtime.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import yaml from 'js-yaml';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const W = 1200;
const H = 630;
const PAPER = '#f4f3ec';
const INK = '#26241d';
const DIM = '#6f6b5d';
const RULE = '#c1bdad';
const NAME = 'William Huang';
const BLURB = 'Fullstack engineer. I build web products and trade my own money.';

const font = await readFile('src/assets/fonts/Newsreader.ttf');

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

const KIND_LABEL = { essay: 'Essay', note: 'Note', log: 'Log' };

/** Read frontmatter out of every .mdx in a content directory. */
async function readCollection(dir) {
  const out = [];
  for (const file of await readdir(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = await readFile(join(dir, file), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    out.push({ id: file.replace(/\.mdx?$/, ''), data: yaml.load(m[1]) });
  }
  return out.filter((e) => !e.data.draft);
}

const box = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

function titleSize(t) {
  if (t.length > 70) return 54;
  if (t.length > 45) return 64;
  return 76;
}

async function render({ title, label, date }) {
  const svg = await satori(
    box(
      {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        padding: '72px 80px',
        fontFamily: 'Newsreader',
      },
      [
        box({ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: DIM }, label),
        box(
          { fontSize: titleSize(title), lineHeight: 1.15, color: INK, letterSpacing: '-0.02em', maxWidth: '92%' },
          title,
        ),
        box(
          {
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `2px solid ${RULE}`,
            paddingTop: 24,
            fontSize: 26,
            color: DIM,
          },
          [box({ color: INK }, NAME), box({}, date)],
        ),
      ],
    ),
    { width: W, height: H, fonts: [{ name: 'Newsreader', data: font, weight: 400, style: 'normal' }] },
  );
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}

const posts = await readCollection('src/content/posts');
const products = await readCollection('src/content/products');

const cards = [
  { slug: 'default', title: BLURB, label: 'wayleem.com', date: '' },
  ...posts.map((e) => ({
    slug: e.id,
    title: e.data.title,
    label: e.data.kind === 'log' && e.data.project ? e.data.project : (KIND_LABEL[e.data.kind] ?? e.data.kind),
    date: fmtDate(e.data.date),
  })),
  ...products.map((e) => ({
    slug: `products-${e.id}`,
    title: e.data.title,
    label: e.data.kind === 'tool' ? 'Tool' : 'Product',
    date: e.data.tagline ?? '',
  })),
];

await mkdir('dist/og', { recursive: true });
for (const card of cards) {
  await writeFile(join('dist/og', `${card.slug}.png`), await render(card));
}
console.log(`[og] ${cards.length} cards → dist/og/`);
