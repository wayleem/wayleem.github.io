// Single source of truth for site chrome: nameplate, nav, footer, and the
// experience list on /about. Content itself lives in src/content.

export const SITE = {
  name: 'William Huang',
  domain: 'wayleem.com',
  url: 'https://wayleem.com',
  /** Nameplate line. Factual, no availability claim, no self-discount. */
  blurb: 'Fullstack engineer. I build web products and trade my own money.',
  description:
    'William Huang — fullstack engineer. Notes on shipping software, and the products I build.',
};

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
];

export interface ContactLink {
  label: string;
  href: string;
  /** rel="me" on profiles that represent me. */
  me?: boolean;
}

// Footer only. Contact is not a destination on this site — it's a detail you
// find once you've read something.
export const CONTACT_LINKS: ContactLink[] = [
  { label: 'Email', href: 'mailto:wayleemh@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/wayleem', me: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wayleem', me: true },
  { label: 'RSS', href: '/rss.xml' },
  // TODO(william): re-add once public/resume.pdf exists — it currently 404s.
  // { label: 'Résumé', href: '/resume.pdf' },
];

export interface Role {
  title: string;
  /** Employers are described, not named — deliberate. */
  org: string;
  period: string;
  summary: string;
}

// TODO(william): fill this in. Orgs stay unnamed by choice — keep the
// descriptions specific enough to be worth reading ("Series A fintech, ~40
// people" beats "a startup"). /about omits the whole section while this is
// empty, so a half-written entry never reaches a reader.
export const EXPERIENCE: Role[] = [];

/**
 * Card cover for an item. A real screenshot in frontmatter wins; otherwise the
 * generated bar-field plate. Products are namespaced so a post and a product can
 * share a slug without colliding.
 */
export function coverFor(id: string, cover?: string | null, isProduct = false): string {
  return cover ?? `/covers/generated/${plateId(id, isProduct)}.png`;
}

/** Link preview for an item — always the generated title plate. */
export function shareImageFor(id: string, isProduct = false): string {
  return `/og/${plateId(id, isProduct)}.png`;
}

const plateId = (id: string, isProduct: boolean) => (isProduct ? `products-${id}` : id);

export const KIND_LABEL: Record<string, string> = {
  essay: 'Essay',
  note: 'Note',
  log: 'Log',
};

/** Feed items show their product name rather than the generic "Log". */
export function itemLabel(kind: string, project?: string | null): string {
  if (kind === 'log' && project) return project;
  return KIND_LABEL[kind] ?? kind;
}

// Frontmatter dates are bare `YYYY-MM-DD`, which parse as UTC midnight. Format
// in UTC too, or every post renders a day early west of Greenwich.
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const fmtDateLong = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** Year of a post, in UTC — same reason as above. */
export const yearOf = (d: Date) => d.getUTCFullYear();
