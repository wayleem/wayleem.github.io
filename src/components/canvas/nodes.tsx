import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SectionDef } from '@/lib/nav';
import type { ItemLink } from './graph';

// Centered, invisible handles so straight edges radiate from node centers.
function CenterHandles() {
  return (
    <>
      <Handle type="target" position={Position.Top} className="rf-handle" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="rf-handle" isConnectable={false} />
    </>
  );
}

export function HubNode({ data }: NodeProps) {
  const { label, tagline } = data as { label: string; tagline: string };
  return (
    <div className="node node--hub">
      <CenterHandles />
      <span className="node__label">{label}</span>
      <span className="node__meta mono">{tagline}</span>
    </div>
  );
}

export function SectionNode({ data }: NodeProps) {
  const { section, expanded, itemCount, onToggle } = data as {
    section: SectionDef;
    expanded: boolean;
    itemCount: number;
    onToggle: () => void;
  };
  const isCollection = section.kind === 'collection';

  // Collections toggle a burst (button); leaves route (anchor). Both are real,
  // focusable elements — keyboard + screen readers work, and the anchor is the
  // no-JS fallback (goes to the index page).
  const inner = isCollection ? (
    <button
      type="button"
      className="node__hit nodrag nopan"
      aria-expanded={expanded}
      onClick={onToggle}
      title={section.hint}
    >
      <span className="node__label">{section.label}</span>
      <span className="node__meta mono">
        {expanded ? '− collapse' : `+ ${itemCount || ''} ${section.hint}`.trim()}
      </span>
    </button>
  ) : (
    <a className="node__hit nodrag nopan" href={section.href} title={section.hint}>
      <span className="node__label">{section.label}</span>
      <span className="node__meta mono">{section.hint} →</span>
    </a>
  );

  return (
    <div className={`node node--section${expanded ? ' is-open' : ''}`}>
      <CenterHandles />
      {inner}
    </div>
  );
}

export function ItemNode({ data }: NodeProps) {
  const { item } = data as { item: ItemLink };
  return (
    <div className={`node node--item${item.more ? ' node--more' : ''}`}>
      <CenterHandles />
      <a className="node__hit nodrag nopan" href={item.href}>
        <span className="node__label">{item.label}</span>
        {item.more ? <span className="node__meta mono">see all →</span> : null}
      </a>
    </div>
  );
}

export const nodeTypes = {
  hub: HubNode,
  section: SectionNode,
  item: ItemNode,
};
