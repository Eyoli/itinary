"use client";

import Dagre from "@dagrejs/dagre";
import { Edge, Node, ReactFlow, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "@/src/components/CustomNode";
import { StopData, WayData } from "@/src/services/types";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } => {
  g.setGraph({
    rankdir: "TB",
  });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const nodeTypes = {
  custom: CustomNode,
};

const LayoutFlow = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) => {
  return (
    <ReactFlow
      defaultNodes={initialNodes}
      edges={initialEdges}
      defaultEdgeOptions={{
        animated: true,
      }}
      nodeTypes={nodeTypes}
    />
  );
};

const RouteFlow = ({ stops, ways }: { stops: StopData[]; ways: WayData[] }) => {
  const initialNodes: Node[] = stops.map((s) => ({
    id: s.stop_id,
    type: "custom",
    position: { x: 0, y: 0 },
    width: 150,
    height: 30,
    data: { label: s.stop_name },
  }));
  const initialEdges: Edge[] = ways.map((way) => ({
    id: `${way.from_stop_id}-${way.to_stop_id}`,
    type: "straight",
    source: way.from_stop_id,
    target: way.to_stop_id,
  }));

  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

  return (
    <ReactFlowProvider>
      <LayoutFlow initialNodes={nodes} initialEdges={edges} />
    </ReactFlowProvider>
  );
};

export default RouteFlow;
