import type { Node, Edge } from '@xyflow/react';
import { SECTIONS, HUB, getSection } from '@/lib/nav';

// A burst item (project or featured post) passed in from the build-time
// content query. `more` marks the "See all →" escape-hatch node.
export interface ItemLink {
  id: string;
  label: string;
  href: string;
  more?: boolean;
}

export interface CanvasData {
  projects: ItemLink[];
  writing: ItemLink[];
}

const DEG = Math.PI / 180;
export const HUB_RADIUS = 240; // hub → section distance
export const ITEM_RADIUS = 200; // section → item distance

function sectionPos(angle: number) {
  return { x: Math.cos(angle * DEG) * HUB_RADIUS, y: Math.sin(angle * DEG) * HUB_RADIUS };
}

// Fan items outward from the section, centered on the section's own outward
// angle so they never point back toward the hub. Wider arc for more items.
function itemPositions(sectionAngle: number, count: number) {
  const spread = Math.min(160, 32 * Math.max(count - 1, 1));
  const start = sectionAngle - spread / 2;
  const step = count > 1 ? spread / (count - 1) : 0;
  const base = sectionPos(sectionAngle);
  return Array.from({ length: count }, (_, i) => {
    const a = (start + step * i) * DEG;
    return { x: base.x + Math.cos(a) * ITEM_RADIUS, y: base.y + Math.sin(a) * ITEM_RADIUS };
  });
}

function itemsFor(id: string, data: CanvasData): ItemLink[] {
  if (id === 'projects') return data.projects;
  if (id === 'writing') return data.writing;
  return [];
}

export interface BuildArgs {
  data: CanvasData;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}

export function buildGraph({ data, expanded, onToggle }: BuildArgs): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: HUB.id,
    type: 'hub',
    position: { x: 0, y: 0 },
    data: { label: HUB.label, tagline: HUB.tagline },
    draggable: false,
  });

  for (const s of SECTIONS) {
    const isExpanded = expanded.has(s.id);
    const items = itemsFor(s.id, data);
    nodes.push({
      id: s.id,
      type: 'section',
      position: sectionPos(s.angle),
      data: {
        section: s,
        expanded: isExpanded,
        itemCount: items.length,
        onToggle: () => onToggle(s.id),
      },
      draggable: false,
    });
    edges.push({
      id: `e-${HUB.id}-${s.id}`,
      source: HUB.id,
      target: s.id,
      type: 'straight',
      animated: isExpanded,
      className: isExpanded ? 'rf-edge rf-edge--active' : 'rf-edge',
    });

    if (isExpanded && items.length) {
      const pos = itemPositions(s.angle, items.length);
      items.forEach((item, i) => {
        const nodeId = `${s.id}:${item.id}`;
        nodes.push({
          id: nodeId,
          type: 'item',
          position: pos[i],
          data: { item, sectionId: s.id },
          draggable: false,
        });
        edges.push({
          id: `e-${s.id}-${nodeId}`,
          source: s.id,
          target: nodeId,
          type: 'straight',
          className: 'rf-edge rf-edge--active',
        });
      });
    }
  }

  return { nodes, edges };
}

// Bounds for panning so a visitor can never lose the map in the void.
export function extentFor(data: CanvasData): [[number, number], [number, number]] {
  const reach = HUB_RADIUS + ITEM_RADIUS + 260;
  return [
    [-reach, -reach],
    [reach, reach],
  ];
}

export { getSection };
