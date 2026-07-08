import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './canvas.css';
import { nodeTypes } from './nodes';
import { buildGraph, extentFor, type CanvasData, type ItemLink } from './graph';
import { COLLECTION_IDS, type SectionDef } from '@/lib/nav';

function readOpenParam(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const raw = new URLSearchParams(window.location.search).get('open');
  if (!raw) return new Set();
  return new Set(raw.split(',').filter((id) => COLLECTION_IDS.includes(id)));
}

function writeOpenParam(ids: Set<string>) {
  const url = new URL(window.location.href);
  if (ids.size) url.searchParams.set('open', [...ids].join(','));
  else url.searchParams.delete('open');
  window.history.replaceState({}, '', url); // shareable / restorable burst state
}

function Flow({ data }: { data: CanvasData }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => readOpenParam());
  const { fitView } = useReactFlow();

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeOpenParam(next);
      return next;
    });
  }, []);

  // Single interaction path (also what re-enables pointer events on nodes):
  // collections toggle their burst; leaves + items navigate. Camera stays put.
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type === 'section') {
        const section = (node.data as { section: SectionDef }).section;
        if (section.kind === 'collection') toggle(section.id);
        else window.location.href = section.href;
      } else if (node.type === 'item') {
        const item = (node.data as { item: ItemLink }).item;
        window.location.href = item.href;
      }
    },
    [toggle],
  );

  const { nodes, edges } = useMemo(() => buildGraph({ data, expanded }), [data, expanded]);

  useEffect(() => {
    const onResize = () => fitView({ padding: 0.3, duration: 200 });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll
      zoomOnPinch
      zoomOnDoubleClick={false}
      panOnScroll={false}
      minZoom={0.4}
      maxZoom={1.6}
      translateExtent={extentFor(data)}
      fitView
      fitViewOptions={{ padding: 0.35 }}
      proOptions={{ hideAttribution: false }}
    >
      <Background variant={BackgroundVariant.Dots} gap={26} size={1.4} color="var(--bg-grid)" />
      <Controls showInteractive={false} position="bottom-right" />
    </ReactFlow>
  );
}

export default function Canvas({ projects, writing }: CanvasData) {
  return (
    <ReactFlowProvider>
      <Flow data={{ projects, writing }} />
    </ReactFlowProvider>
  );
}
