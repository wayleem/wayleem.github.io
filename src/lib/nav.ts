// Single source of truth for the map's top-level structure.
// Feeds the ReactFlow canvas AND the hidden <nav> so they never drift.

export type SectionKind = 'collection' | 'text' | 'links';

export interface SectionDef {
  id: string;
  label: string;
  kind: SectionKind;
  /** No-JS fallback + SEO target (also where the hidden nav points). */
  href: string;
  /** Placement around the hub, degrees. 0=east, 90=south, 180=west, 270=north. */
  angle: number;
  /** Flat solid node color. */
  color: string;
  hint: string;
}

export const HUB = {
  id: 'you',
  label: 'wayleem',
  tagline: 'i make stuff',
  href: '/',
  color: '#26241d',
};

export const SECTIONS: SectionDef[] = [
  { id: 'work', label: 'work', kind: 'collection', href: '/work', angle: 0, color: '#3b6fe0', hint: 'work & projects' },
  { id: 'contact', label: 'contact', kind: 'links', href: '/contact', angle: 90, color: '#ef6a4c', hint: 'say hi' },
  { id: 'about', label: 'about', kind: 'text', href: '/about', angle: 180, color: '#f2b134', hint: 'who i am' },
  { id: 'writing', label: 'writing', kind: 'collection', href: '/writing', angle: 270, color: '#33a866', hint: 'notes' },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export function getSection(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

// Short bio shown inline (as a panel beside the About node). Keep it brief —
// it lives on the canvas, not a page. Longer version can go on /about.
export const ABOUT_BLURB =
  "hey — i'm wayleem. i build web things, trade a little, and tinker with whatever's interesting that week. this site is a map; poke around.";

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  /** 'message' opens the send-message modal instead of navigating. */
  action?: 'message';
}

export const CONTACT_LINKS: ContactLink[] = [
  { id: 'message', label: 'message', href: '#', action: 'message' },
  { id: 'email', label: 'email', href: 'mailto:wayleemh@gmail.com', external: true },
  { id: 'github', label: 'github', href: 'https://github.com/wayleem', external: true },
  { id: 'linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/wayleem', external: true },
  { id: 'resume', label: 'resume', href: '/resume.pdf', external: true },
];
