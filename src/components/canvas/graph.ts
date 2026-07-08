import type { Node, Edge } from '@xyflow/react';
import { SECTIONS, HUB, ABOUT_BLURB, CONTACT_LINKS } from '@/lib/nav';

// A burst node (work/writing item, or a contact link/action).
export interface ItemLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  action?: 'message';
  more?: boolean;
  color?: string;
}

export interface CanvasData {
  work: ItemLink[];
  writing: ItemLink[];
}

const DEG = Math.PI / 180;
export const HUB_RADIUS = 250; // hub → section
export const ITEM_RADIUS = 190; // section → burst item
const PANEL_W = 250;
const PANEL_H = 150;
const PANEL_GAP = 46;

function sectionPos(angle: number) {
  return { x: Math.cos(angle * DEG) * HUB_RADIUS, y: Math.sin(angle * DEG) * HUB_RADIUS };
}

// Fan items outward from the section, centered on its outward angle.
function itemPositions(sectionAngle: number, count: number) {
  const spread = Math.min(150, 34 * Math.max(count - 1, 1));
  const start = sectionAngle - spread / 2;
  const step = count > 1 ? spread / (count - 1) : 0;
  const base = sectionPos(sectionAngle);
  return Array.from({ length: count }, (_, i) => {
    const a = (start + step * i) * DEG;
    return { x: base.x + Math.cos(a) * ITEM_RADIUS, y: base.y + Math.sin(a) * ITEM_RADIUS };
  });
}

export interface BuildArgs {
  data: CanvasData;
  expanded: Set<string>;
}

export function buildGraph({ data, expanded }: BuildArgs): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: HUB.id,
    type: 'hub',
    position: { x: 0, y: 0 },
    data: { label: HUB.label, tagline: HUB.tagline, color: HUB.color },
    draggable: false,
  });

  for (const s of SECTIONS) {
    const isOpen = expanded.has(s.id);
    nodes.push({
      id: s.id,
      type: 'section',
      position: sectionPos(s.angle),
      data: { section: s, expanded: isOpen, color: s.color },
      draggable: false,
    });
    edges.push({
      id: `e-${HUB.id}-${s.id}`,
      source: HUB.id,
      target: s.id,
      type: 'straight',
      className: isOpen ? 'rf-edge rf-edge--active' : 'rf-edge',
    });
    if (!isOpen) continue;

    if (s.kind === 'text') {
      // About: a text panel to the LEFT of the section.
      const base = sectionPos(s.angle);
      const id = `${s.id}:panel`;
      nodes.push({
        id,
        type: 'panel',
        position: { x: base.x - PANEL_GAP - PANEL_W, y: base.y - PANEL_H / 2 },
        data: { text: ABOUT_BLURB, color: s.color },
        draggable: false,
      });
      // No edge — the panel's position next to About already implies it.
      continue;
    }

    // Collections (work/writing) and links (contact) both burst circular items.
    const items: ItemLink[] =
      s.kind === 'links'
        ? CONTACT_LINKS.map((l) => ({ ...l, color: s.color }))
        : (s.id === 'work' ? data.work : data.writing).map((l) => ({ ...l, color: s.color }));

    const pos = itemPositions(s.angle, items.length);
    items.forEach((item, i) => {
      const id = `${s.id}:${item.id}`;
      nodes.push({
        id,
        type: 'item',
        position: pos[i],
        data: { item, color: s.color },
        draggable: false,
      });
      // Writing posts stand on their own — position implies the link, no edge.
      if (s.id !== 'writing') {
        edges.push({ id: `e-${s.id}-${id}`, source: s.id, target: id, type: 'straight', className: 'rf-edge rf-edge--active' });
      }
    });
  }

  return { nodes, edges };
}

// Node ids that belong to a section's expanded cluster (for auto-pan framing).
export function clusterNodeIds(sectionId: string, nodes: Node[]): string[] {
  return [sectionId, ...nodes.filter((n) => n.id.startsWith(`${sectionId}:`)).map((n) => n.id)];
}

export function extentFor(_data: CanvasData): [[number, number], [number, number]] {
  const reach = HUB_RADIUS + ITEM_RADIUS + 420;
  return [
    [-reach, -reach],
    [reach, reach],
  ];
}
