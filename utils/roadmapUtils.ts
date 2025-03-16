import { Node, Edge } from 'reactflow';

export function generateRoadmapElements(roadmapData: any) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 1;
  let edgeId = 1;

  // Helper function to add nodes and edges
  const addTopics = (topics: any[], type: string, startY: number) => {
    topics.forEach((topic, index) => {
      const node: Node = {
        id: `${type}-${nodeId}`,
        type: 'roadmapNode',
        position: { x: 300 * index, y: startY },
        data: {
          title: topic.title,
          description: topic.description,
          keyConcepts: topic.keyConcepts,
          resources: topic.resources
        }
      };
      nodes.push(node);

      if (index > 0) {
        edges.push({
          id: `e${edgeId}`,
          source: `${type}-${nodeId - 1}`,
          target: `${type}-${nodeId}`,
          type: 'smoothstep',
          animated: true
        });
        edgeId++;
      }
      nodeId++;
    });
  };

  // Add fundamental topics
  addTopics(roadmapData.fundamentalTopics, 'fundamental', 0);

  // Add beginner topics
  addTopics(roadmapData.beginnerTopics, 'beginner', 200);

  // Add intermediate topics
  addTopics(roadmapData.intermediateTopics, 'intermediate', 400);

  // Add advanced topics
  addTopics(roadmapData.advancedTopics, 'advanced', 600);

  // Connect levels
  const connectLevels = (sourceType: string, targetType: string, sourceIndex: number, targetIndex: number) => {
    edges.push({
      id: `e${edgeId}`,
      source: `${sourceType}-${sourceIndex}`,
      target: `${targetType}-${targetIndex}`,
      type: 'smoothstep',
      animated: true
    });
    edgeId++;
  };

  // Connect fundamental to beginner
  connectLevels('fundamental', 'beginner', 1, 2);

  // Connect beginner to intermediate
  connectLevels('beginner', 'intermediate', 2, 3);

  // Connect intermediate to advanced
  connectLevels('intermediate', 'advanced', 3, 4);

  return { nodes, edges };
}

