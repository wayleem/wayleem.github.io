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

// Nodes are purely visual (flat solid circle + label beneath). All interaction
// is handled by onNodeClick in Canvas.tsx.

export function HubNode({ data }: NodeProps) {
  const { label, color } = data as { label: string; color: string };
  return (
    <div className="cnode cnode--hub" title={label}>
      <CenterHandles />
      <span className="cnode__dot" style={{ background: color }} aria-hidden="true" />
      <span className="cnode__label">{label}</span>
    </div>
  );
}

export function SectionNode({ data }: NodeProps) {
  const { section, expanded, color } = data as {
    section: SectionDef;
    expanded: boolean;
    color: string;
  };
  return (
    <div
      className={`cnode cnode--section${expanded ? ' is-open' : ''}`}
      title={section.label}
    >
      <CenterHandles />
      <span className="cnode__dot" style={{ background: color }} aria-hidden="true" />
      <span className="cnode__label">{section.label}</span>
    </div>
  );
}

export function ItemNode({ data }: NodeProps) {
  const { item, color } = data as { item: ItemLink; color: string };
  return (
    <div className={`cnode cnode--item${item.action ? ' is-action' : ''}`} title={item.label}>
      <CenterHandles />
      <span className="cnode__dot" style={{ background: color }} aria-hidden="true" />
      <span className="cnode__label">
        {item.label}
        {item.external ? ' ↗' : ''}
      </span>
    </div>
  );
}

export function PanelNode({ data }: NodeProps) {
  const { text, color } = data as { text: string; color: string };
  return (
    <div className="cpanel" style={{ borderColor: color }}>
      <CenterHandles />
      <span className="cpanel__accent" style={{ background: color }} aria-hidden="true" />
      <p className="cpanel__text">{text}</p>
    </div>
  );
}

export const nodeTypes = {
  hub: HubNode,
  section: SectionNode,
  item: ItemNode,
  panel: PanelNode,
};
