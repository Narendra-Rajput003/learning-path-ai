"use client";

import ReactFlow, { 
  Node, Edge, Background, Controls, MiniMap,
  ConnectionMode, useReactFlow, ReactFlowProvider
} from 'reactflow';
import { useCallback, useMemo, useState, useEffect } from 'react';
import CustomNode from './CustomNode';
import ProjectsModal from './ProjectsModal';
import { motion } from 'framer-motion';
import { Lock, Unlock, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'reactflow/dist/style.css';

// Move nodeTypes outside the component
const nodeTypes = {
  custom: CustomNode,
} as const;

const LEVEL_HEIGHT = 300;  // Vertical spacing between levels
const NODE_WIDTH = 300;    // Width of each node
const NODE_SPACING = 100;  // Horizontal spacing between nodes

function Flow({ roadmapData, onShowAllProjects }) {
  const [locked, setLocked] = useState(true);
  const { fitView } = useReactFlow();

  const calculateNodePosition = useCallback((index: number, totalInRow: number, level: number) => {
    const rowWidth = totalInRow * (NODE_WIDTH + NODE_SPACING);
    const startX = -(rowWidth / 2) + (NODE_WIDTH / 2);
    return {
      x: startX + (index * (NODE_WIDTH + NODE_SPACING)),
      y: level * LEVEL_HEIGHT
    };
  }, []);

  const nodes: Node[] = useMemo(() => {
    let nodeCounter = 1;
    const createNodes = (topics: any[], level: number, type: string) => {
      return topics.map((topic, index) => ({
        id: topic.id || `${type}-${index}`,
        type: 'custom',
        position: calculateNodePosition(index, topics.length, level),
        data: {
          ...topic,
          type,
          stepNumber: nodeCounter++
        },
        draggable: !locked
      }));
    };

    return [
      ...createNodes(roadmapData.fundamentalTopics || [], 0, 'fundamental'),
      ...createNodes(roadmapData.beginnerTopics || [], 1, 'beginner'),
      ...createNodes(roadmapData.intermediateTopics || [], 2, 'intermediate'),
      ...createNodes(roadmapData.advancedTopics || [], 3, 'advanced'),
    ];
  }, [roadmapData, locked, calculateNodePosition]);

  const edges: Edge[] = useMemo(() => {
    const createEdges = (nodes: Node[]) => {
      return nodes.reduce((acc: Edge[], node, index, array) => {
        if (index < array.length - 1) {
          acc.push({
            id: `${node.id}-${array[index + 1].id}`,
            source: node.id,
            target: array[index + 1].id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#c084fc', strokeWidth: 2 }
          });
        }
        return acc;
      }, []);
    };

    return createEdges(nodes);
  }, [nodes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ 
        padding: 0.2,
        duration: 800,
        maxZoom: 1.0
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [fitView, nodes]);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        <Button
          onClick={onShowAllProjects}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Code className="w-4 h-4" />
          View All Projects
        </Button>
        <Button
          variant="outline"
          onClick={() => setLocked(!locked)}
          className="bg-black/40 backdrop-blur-sm"
        >
          {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
      </div>

      <div className="h-[800px] bg-black/[0.96] rounded-xl border border-white/10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          connectionMode={ConnectionMode.Loose}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#ffffff" style={{ backgroundColor: 'transparent' }} />
          <Controls className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 rounded-lg" />
          <MiniMap 
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg"
            nodeColor={(node) => {
              switch (node.data.type) {
                case 'fundamental': return '#c084fc';
                case 'beginner': return '#86efac';
                case 'intermediate': return '#fde047';
                case 'advanced': return '#f87171';
                default: return '#94a3b8';
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function RoadmapFlow({ roadmapData }) {
  const [showProjects, setShowProjects] = useState(false);

  const allProjects = useMemo(() => {
    return [
      ...(roadmapData.fundamentalTopics || []),
      ...(roadmapData.beginnerTopics || []),
      ...(roadmapData.intermediateTopics || []),
      ...(roadmapData.advancedTopics || [])
    ].flatMap(topic => topic.projects || []);
  }, [roadmapData]);

  return (
    <>
      <ReactFlowProvider>
        <Flow 
          roadmapData={roadmapData} 
          onShowAllProjects={() => setShowProjects(true)} 
        />
      </ReactFlowProvider>

      {showProjects && (
        <ProjectsModal
          projects={allProjects}
          onClose={() => setShowProjects(false)}
        />
      )}
    </>
  );
}








