"use client";

import React from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge,
  MarkerType,
  Node,
  Position,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import { motion } from 'framer-motion';
import { RoadmapData } from '@/types/roadmap';
import CustomNode from './custom-nodes';
import { useTheme } from 'next-themes';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

export default function Roadmap({ roadmap }: { roadmap: RoadmapData }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const currentTheme = mounted ? theme === 'system' ? systemTheme : theme : 'light';

React.useEffect(() => {
  if (roadmap && mounted) {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    let nodeId = 1;

    // Create main topic node
    initialNodes.push({
      id: '1',
      type: 'custom',
      position: { x: 400, y: 100 },
      data: {
        type: 'mainTopic',
        label: roadmap.mainTopics[0].title,
        description: roadmap.mainTopics[0].description,
      },
    });

    // Create subtopic nodes
    roadmap.mainTopics[0].subTopics.forEach((topic, index) => {
      nodeId++;
      const topicId = nodeId.toString();
      
      initialNodes.push({
        id: topicId,
        type: 'custom',
        position: { 
          x: 200 + (index % 3) * 400, 
          y: 300 + Math.floor(index / 3) * 300 
        },
        data: {
          type: 'subTopic',
          label: topic.title,
          description: topic.description,
          resources: topic.resources,
          projects: topic.projects,
        },
      });

      initialEdges.push({
        id: `e1-${topicId}`,
        source: '1',
        target: topicId,
        ...getEdgeStyle(),
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }
}, [roadmap, mounted, currentTheme]);

  

  const getEdgeStyle = React.useCallback(() => ({
    animated: true,
    style: {
      stroke: currentTheme === 'dark' ? '#8b5cf6' : '#6366f1',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: currentTheme === 'dark' ? '#8b5cf6' : '#6366f1',
    },
  }), [currentTheme]);

  // Initialize nodes and edges when roadmap data changes
  React.useEffect(() => {
    if (roadmap && mounted) {
      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];
      let nodeId = 1;

      // Create main topic node
      initialNodes.push({
        id: '1',
        type: 'custom',
        position: { x: 400, y: 100 },
        data: {
          type: 'mainTopic',
          label: roadmap.mainTopics[0].title,
          description: roadmap.mainTopics[0].description,
        },
      });

      // Create subtopic nodes
      roadmap.mainTopics[0].subTopics.forEach((topic, index) => {
        nodeId++;
        const topicId = nodeId.toString();
        
        initialNodes.push({
          id: topicId,
          type: 'custom',
          position: { 
            x: 200 + (index % 3) * 400, 
            y: 300 + Math.floor(index / 3) * 300 
          },
          data: {
            type: 'subTopic',
            label: topic.title,
            description: topic.description,
            resources: topic.resources,
            projects: topic.projects,
          },
        });

        initialEdges.push({
          id: `e1-${topicId}`,
          source: '1',
          target: topicId,
          ...getEdgeStyle(),
        });
      });

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [roadmap, mounted, currentTheme]);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full h-[800px] rounded-xl overflow-hidden border dark:border-gray-800"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className={`
          ${currentTheme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-indigo-50 to-purple-50'}
        `}
      >
        <Background 
          color={currentTheme === 'dark' ? '#374151' : '#6366f1'} 
          gap={16} 
          size={1} 
        />
        <Controls 
          className={`
            ${currentTheme === 'dark' 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'bg-white/80 border border-gray-200'} 
            backdrop-blur-sm rounded-lg p-2
          `}
        />
        <Panel position="top-right" className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const flow = document.querySelector('.react-flow');
              if (flow) {
                flow.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, ctrlKey: true }));
              }
            }}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const flow = document.querySelector('.react-flow');
              if (flow) {
                flow.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, ctrlKey: true }));
              }
            }}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const flow = document.querySelector('.react-flow');
              if (flow) {
                // @ts-ignore
                flow.__reactFlowInstance.fitView();
              }
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </motion.div>
  );
}
