import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './canvas.css';
import { nodeTypes } from './nodes';
import { buildGraph, extentFor, type CanvasData } from './graph';
import { COLLECTION_IDS } from '@/lib/nav';

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

  const onToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeOpenParam(next);
      return next;
    });
  }, []);

  // Camera stays put on burst (spec: "radial burst in place"). We only refit on
  // resize so mobile always frames the whole map.
  const { nodes, edges } = useMemo(
    () => buildGraph({ data, expanded, onToggle }),
    [data, expanded, onToggle],
  );

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
