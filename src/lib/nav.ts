// Single source of truth for the site's top-level structure.
// Consumed by BOTH the ReactFlow canvas (visual nodes) and the hidden <nav>
// (crawlable/keyboard-accessible links) so they can never drift apart.

export type SectionKind = 'leaf' | 'collection';

export interface SectionDef {
  id: string;
  label: string;
  kind: SectionKind;
  /** Where the node points. Leaves route here; collections use this as the
   *  no-JS fallback + "see all" target while JS intercepts to burst. */
  href: string;
  /** Placement around the hub, in degrees. 0 = east, 90 = south, 180 = west,
   *  270 = north (screen coords, y-down). */
  angle: number;
  hint: string;
}

export const HUB = {
  id: 'you',
  label: 'Wayleem',
  tagline: 'building things',
  href: '/',
};

export const SECTIONS: SectionDef[] = [
  { id: 'projects', label: 'Projects', kind: 'collection', href: '/work', angle: 0, hint: 'things I have built' },
  { id: 'contact', label: 'Contact', kind: 'leaf', href: '/contact', angle: 90, hint: 'get in touch' },
  { id: 'about', label: 'About', kind: 'leaf', href: '/about', angle: 180, hint: 'who I am' },
  { id: 'writing', label: 'Writing', kind: 'collection', href: '/writing', angle: 270, hint: 'notes & posts' },
];

export const COLLECTION_IDS = SECTIONS.filter((s) => s.kind === 'collection').map((s) => s.id);

export function getSection(id: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.id === id);
}
