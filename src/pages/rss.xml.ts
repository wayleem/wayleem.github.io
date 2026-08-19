import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, itemLabel } from '@/lib/site';
import type { APIContext } from 'astro';

// Everything in the river, essays and logs alike — the feed mirrors the front
// page rather than being a curated subset.
export async function GET(context: APIContext) {
  const posts = (await getCollection('posts'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => +b.data.date - +a.data.date);

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/blog/${e.id}/`,
      categories: [itemLabel(e.data.kind, e.data.project)],
    })),
  });
}
