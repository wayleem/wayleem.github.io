// Two generated plates per post and product:
//
//   public/og/<slug>.png      1200x630  ink + the title. Link previews.
//   public/covers/generated/<slug>.png  1200x675  ink + seeded bars. Card covers.
//
// They differ on purpose. A shared link should carry the headline; a card
// already prints the headline underneath it, so repeating it there reads as a
// bug. The card plate instead varies per item by hashing the slug, so two
// skadooble log entries never render the same picture.
//
// Runs at PREbuild into public/, not postbuild into dist/: the pages reference
// these by path, so they must exist before Astro builds and during `dev`.
// Deliberately not an Astro endpoint — resvg ships a native binary that cannot
// be bundled into a Cloudflare Worker, and satori rejects variable fonts, so
// src/assets/fonts/Newsreader.ttf must stay a static instance.
//
// A product with a real screenshot in its `cover` frontmatter beats both; these
// are the floor, not the ceiling.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import yaml from 'js-yaml';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const INK = '#26241d';
const PAPER = '#f4f3ec';
const PAPER_DIM = '#a8a290';
const BAR = '#3b382d';
const BAR_LIT = '#6b6552';
const NAME = 'William Huang';
const BLURB = 'Fullstack engineer. I build web products and trade my own money.';
const KIND_LABEL = { essay: 'Essay', note: 'Note', log: 'Log' };

const font = await readFile('src/assets/fonts/Newsreader.ttf');

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

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

const box = (style, children) => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/** FNV-1a. Small, stable, and enough to seed a deterministic layout. */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Seeded PRNG so a slug always draws the same field. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function titleSize(t) {
  if (t.length > 70) return 54;
  if (t.length > 45) return 64;
  return 76;
}

async function toPng(node, width, height) {
  const svg = await satori(node, {
    width,
    height,
    fonts: [{ name: 'Newsreader', data: font, weight: 400, style: 'normal' }],
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

/** Link preview: ink ground, the headline, a rule, name and date. */
function sharePlate({ title, label, date }) {
  return box(
    {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: INK,
      padding: '72px 80px',
      fontFamily: 'Newsreader',
    },
    [
      box({ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: PAPER_DIM }, label),
      box(
        { fontSize: titleSize(title), lineHeight: 1.15, color: PAPER, letterSpacing: '-0.02em', maxWidth: '92%' },
        title,
      ),
      box(
        {
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: `2px solid ${BAR_LIT}`,
          paddingTop: 24,
          fontSize: 26,
          color: PAPER_DIM,
        },
        [box({ color: PAPER }, NAME), box({}, date)],
      ),
    ],
  );
}

/**
 * Card cover: a field of vertical bars whose count, widths, heights and one
 * highlighted column are all seeded from the slug. Carries no text at all — the
 * card prints the label, date and title directly beneath it, and a real
 * screenshot has to be able to drop in here without anything else changing.
 */
function cardPlate({ slug }) {
  const rand = rng(hash(slug));
  const count = 16 + Math.floor(rand() * 10);
  const lit = Math.floor(rand() * count);
  const bars = Array.from({ length: count }, (_, i) => {
    const h = 22 + rand() * 68;
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: `${3 + rand() * 12}px`,
          height: `${h}%`,
          background: i === lit ? BAR_LIT : BAR,
          borderRadius: '2px',
        },
      },
    };
  });

  return box(
    {
      width: '100%',
      height: '100%',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '12px',
      background: INK,
      padding: '90px 72px',
      overflow: 'hidden',
    },
    bars,
  );
}

const posts = await readCollection('src/content/posts');
const products = await readCollection('src/content/products');

const items = [
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

await mkdir('public/og', { recursive: true });
await mkdir('public/covers/generated', { recursive: true });
for (const item of items) {
  await writeFile(join('public/og', `${item.slug}.png`), await toPng(sharePlate(item), 1200, 630));
  await writeFile(join('public/covers/generated', `${item.slug}.png`), await toPng(cardPlate(item), 1200, 675));
}
console.log(`[covers] ${items.length} share plates → public/og/, ${items.length} card plates → public/covers/generated/`);
