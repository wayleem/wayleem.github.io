import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import { navigate } from 'astro:transitions/client';
import '@xyflow/react/dist/style.css';
import './canvas.css';
import { nodeTypes } from './nodes';
import Modal from './Modal';
import { buildGraph, clusterNodeIds, extentFor, type CanvasData, type ItemLink } from './graph';
import { SECTION_IDS, type SectionDef } from '@/lib/nav';

function readOpenParam(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const raw = new URLSearchParams(window.location.search).get('open');
  if (!raw) return new Set();
  return new Set(raw.split(',').filter((id) => SECTION_IDS.includes(id)));
}

function writeOpenParam(ids: Set<string>) {
  const url = new URL(window.location.href);
  if (ids.size) url.searchParams.set('open', [...ids].join(','));
  else url.searchParams.delete('open');
  window.history.replaceState({}, '', url); // shareable / restorable state
}

function Flow({ data }: { data: CanvasData }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => readOpenParam());
  const [modalOpen, setModalOpen] = useState(false);
  const pendingFocus = useRef<string | null>(null);
  const { fitView } = useReactFlow();

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        pendingFocus.current = id; // auto-pan to it once it renders
      }
      writeOpenParam(next);
      return next;
    });
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type === 'section') {
        toggle((node.data as { section: SectionDef }).section.id);
        return;
      }
      if (node.type === 'item') {
        const item = (node.data as { item: ItemLink }).item;
        if (item.action === 'message') setModalOpen(true);
        else if (item.external) window.open(item.href, item.href.startsWith('mailto:') ? '_self' : '_blank');
        else navigate(item.href); // animated view transition
      }
      // panel / hub: no-op
    },
    [toggle],
  );

  const { nodes, edges } = useMemo(() => buildGraph({ data, expanded }), [data, expanded]);

  // Auto-pan to a section's cluster right after it expands — MOBILE ONLY.
  // On desktop the camera stays put.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const id = pendingFocus.current;
    pendingFocus.current = null;
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const ids = clusterNodeIds(id, nodes).map((i) => ({ id: i }));
    const raf = requestAnimationFrame(() =>
      fitView({ nodes: ids, padding: 0.3, duration: 500, maxZoom: 1.2 }),
    );
    return () => cancelAnimationFrame(raf);
  }, [nodes, fitView]);

  useEffect(() => {
    const onResize = () => fitView({ padding: 0.35, duration: 200 });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitView]);

  return (
    <>
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
        fitViewOptions={{ padding: 0.4 }}
        proOptions={{ hideAttribution: false }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.6} color="var(--bg-grid)" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
    </>
  );
}

export default function Canvas({ projects, writing }: { projects: ItemLink[]; writing: ItemLink[] }) {
  return (
    <ReactFlowProvider>
      <Flow data={{ work: projects, writing }} />
    </ReactFlowProvider>
  );
}
