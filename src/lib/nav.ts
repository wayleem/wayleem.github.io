// Single source of truth for the hub map + rooms.
// Consumed by the hub, the room views, the hidden <nav>, and the transition
// controller (which reads `dir` to know which way to pan).

export type PanDir = 'right' | 'down' | 'left' | 'up';

export interface SectionDef {
  id: string;
  label: string;
  /** Placement around the hub, degrees. 0=east, 90=south, 180=west, 270=north. */
  angle: number;
  /** Which way the camera pans when entering this room (matches the angle). */
  dir: PanDir;
  /** Flat solid node color. */
  color: string;
  /** Crawlable/no-JS fallback target for the hidden nav. */
  href: string;
  hint: string;
}

export const HUB = {
  id: 'you',
  label: 'wayleem',
  tagline: 'i make stuff',
  color: '#26241d',
};

export const SECTIONS: SectionDef[] = [
  { id: 'work', label: 'work', angle: 0, dir: 'right', color: '#3b6fe0', href: '/work', hint: 'work & projects' },
  { id: 'contact', label: 'contact', angle: 90, dir: 'down', color: '#ef6a4c', href: '/contact', hint: 'say hi' },
  { id: 'about', label: 'about', angle: 180, dir: 'left', color: '#f2b134', href: '/about', hint: 'who i am' },
  { id: 'writing', label: 'writing', angle: 270, dir: 'up', color: '#33a866', href: '/writing', hint: 'notes' },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export function getSection(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}

// About room copy.
export const ABOUT = {
  intro: "hey — i'm wayleem.",
  body:
    "i build web things, poke at markets, and tinker with whatever's interesting that week. i like small tools, clean type, and shipping stuff that's a little weird. this site is a map — each node is a room; go have a look.",
  now: 'now: building this site, trading a little, learning whatever the current rabbit hole demands.',
};

export interface ContactLink {
  id: string;
  label: string;
  href: string;
}

export const CONTACT_LINKS: ContactLink[] = [
  { id: 'email', label: 'email', href: 'mailto:wayleemh@gmail.com' },
  { id: 'github', label: 'github', href: 'https://github.com/wayleem' },
  { id: 'linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/wayleem' },
  { id: 'resume', label: 'résumé', href: '/resume.pdf' },
];
