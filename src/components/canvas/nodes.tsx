import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SectionDef } from '@/lib/nav';
import type { ItemLink } from './graph';

// Centered, invisible handles so straight edges radiate from circle centers.
function CenterHandles() {
  return (
    <>
      <Handle type="target" position={Position.Top} className="rf-handle" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="rf-handle" isConnectable={false} />
    </>
  );
}

// Nodes are purely visual (a circle + a label beneath). All interaction is
// handled by React Flow's onNodeClick in Canvas.tsx — which also re-enables
// pointer events on the node. Crawlable/keyboard links live in the hidden nav.

export function HubNode({ data }: NodeProps) {
  const { label } = data as { label: string };
  return (
    <div className="cnode cnode--hub" title={label}>
      <CenterHandles />
      <span className="cnode__dot" aria-hidden="true" />
      <span className="cnode__label">{label}</span>
    </div>
  );
}

export function SectionNode({ data }: NodeProps) {
  const { section, expanded } = data as { section: SectionDef; expanded: boolean };
  const cls = [
    'cnode cnode--section',
    section.kind === 'collection' ? 'is-collection' : 'is-leaf',
    expanded ? 'is-open' : '',
  ]
    .join(' ')
    .trim();
  return (
    <div className={cls} title={section.label}>
      <CenterHandles />
      <span className="cnode__dot" aria-hidden="true" />
      <span className="cnode__label">{section.label}</span>
    </div>
  );
}

export function ItemNode({ data }: NodeProps) {
  const { item } = data as { item: ItemLink };
  return (
    <div className={`cnode cnode--item${item.more ? ' is-more' : ''}`} title={item.label}>
      <CenterHandles />
      <span className="cnode__dot" aria-hidden="true" />
      <span className="cnode__label">{item.label}</span>
    </div>
  );
}

export const nodeTypes = {
  hub: HubNode,
  section: SectionNode,
  item: ItemNode,
};
