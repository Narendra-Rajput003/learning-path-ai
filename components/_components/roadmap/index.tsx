"use client";

import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Edge,
  MarkerType,
  Node,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import { motion } from 'framer-motion';
import { RoadmapData } from '@/types/roadmap';
import CustomNode from './custom_nodes';
import { useTheme } from 'next-themes';
import { CheckCircle, Circle, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CalendarDialog } from './calendar-dialog';
import { RatingPopup } from '../rating/rating-popup';
import 'reactflow/dist/style.css';
import { QuizModal } from '../gamification/quiz-modal';
import { toast } from 'react-toastify';
import { Brain } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

const RoadmapFlow = ({ roadmap }: { roadmap: RoadmapData }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const currentTheme = mounted ? theme === 'system' ? systemTheme : theme : 'light';
  const { fitView } = useReactFlow();
  const flowRef = React.useRef(null);

  const handleDownloadPDF = async () => {
    if (flowRef.current) {
      const canvas = await html2canvas(flowRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('roadmap.pdf');
    }
  };

  // Progress tracking
  const handleNodeStatusChange = useCallback((nodeId: string, status: 'completed' | 'pending') => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: status
            }
          };
        }
        return node;
      })
    );
    
    const progress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    progress[nodeId] = status;
    localStorage.setItem('roadmapProgress', JSON.stringify(progress));
  }, [setNodes]);

  // Initialize nodes and edges
  React.useEffect(() => {
    if (roadmap && mounted) {
      const initialNodes: Node[] = [];
      const initialEdges: Edge[] = [];
      
      // Learning Path Node (Top Center)
      const learningPathNode = {
        id: 'learning-path',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: {
          type: 'mainTopic',
          label: 'Learning Journey',
          description: 'Complete learning path from beginner to advanced',
          stages: roadmap.learningPath
        }
      };
      initialNodes.push(learningPathNode);

      // Calculate positions for main topics in a vertical layout
      roadmap.mainTopics.forEach((topic, index) => {
        const verticalSpacing = 300;
        const horizontalOffset = index % 2 === 0 ? -300 : 300;
        const topicId = `topic-${index}`;
        
        initialNodes.push({
          id: topicId,
          type: 'custom',
          position: { 
            x: 400 + horizontalOffset,
            y: 200 + (index * verticalSpacing)
          },
          data: {
            type: 'mainTopic',
            label: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
            timeEstimate: topic.timeEstimate,
            prerequisites: topic.prerequisites,
            industryApplication: topic.industryApplication,
            certifications: topic.certifications,
            careerPath: topic.careerPath
          }
        });

        // Connect to learning path with curved edges
        initialEdges.push({
          id: `e-learning-${topicId}`,
          source: 'learning-path',
          target: topicId,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: currentTheme === 'dark' ? '#8b5cf6' : '#6366f1',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: currentTheme === 'dark' ? '#8b5cf6' : '#6366f1',
          },
        });

        // Create subtopic nodes in a grid layout
        topic.subTopics.forEach((subtopic, subIndex) => {
          const subTopicId = `${topicId}-sub-${subIndex}`;
          const subHorizontalOffset = subIndex % 2 === 0 ? -150 : 150;
          
          initialNodes.push({
            id: subTopicId,
            type: 'custom',
            position: {
              x: 400 + horizontalOffset + subHorizontalOffset,
              y: 200 + (index * verticalSpacing) + 150
            },
            data: {
              type: 'subTopic',
              label: subtopic.title,
              description: subtopic.description,
              difficulty: subtopic.difficulty,
              timeEstimate: subtopic.timeEstimate,
              concepts: subtopic.concepts,
              keyPoints: subtopic.keyPoints,
              commonPitfalls: subtopic.commonPitfalls,
              resources: subtopic.resources,
              practicalExercises: subtopic.practicalExercises
            }
          });

          initialEdges.push({
            id: `e-${topicId}-${subTopicId}`,
            source: topicId,
            target: subTopicId,
            type: 'smoothstep',
            animated: true,
            style: { 
              stroke: currentTheme === 'dark' ? '#8b5cf6' : '#6366f1',
              strokeWidth: 1.5,
            }
          });
        });
      });

      setNodes(initialNodes);
      setEdges(initialEdges);
      
      // Fit view with animation after nodes are set
      setTimeout(() => {
        fitView({ duration: 1000, padding: 0.2 });
      }, 100);
    }
  }, [roadmap, mounted, currentTheme, setNodes, setEdges, fitView]);

  if (!mounted) return null;

  const completedNodes = nodes.filter(n => n.data.status === 'completed').length;
  const totalNodes = nodes.length;
  const progressPercentage = Math.round((completedNodes / totalNodes) * 100) || 0;

  const handleStartQuiz = async () => {
    // Generate quiz questions based on roadmap content
    const questions = generateQuizQuestions(roadmap);
    setQuizQuestions(questions);
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    // Handle quiz completion (e.g., save score, show achievements)
    toast.success(`Quiz completed! Score: ${score}/${quizQuestions.length}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Section - Controls and Progress */}
      <div className="flex justify-between items-center p-4 bg-background rounded-lg shadow">
        <div className="flex items-center gap-4">
          <Button onClick={handleDownloadPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => setIsCalendarOpen(true)} variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Learning
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="font-semibold">{progressPercentage}% Complete</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span>{completedNodes} / {totalNodes} Topics</span>
          </div>
        </div>
      </div>

      {/* Main Roadmap Flow */}
      <div ref={flowRef} className="h-[600px] rounded-xl border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className={currentTheme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900'
            : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
          }
        >
          <Background color={currentTheme === 'dark' ? '#374151' : '#6366f1'} gap={16} size={1} />
          <Controls className={`${currentTheme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`} />
        </ReactFlow>
      </div>

      {/* Calendar Dialog */}
      <CalendarDialog
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        roadmapTitle={roadmap.title}
      />

      {showRatingPopup && (
        <RatingPopup 
          roadmapTitle={roadmap.title}
          onClose={() => setShowRatingPopup(false)}
        />
      )}

      {/* Quiz Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleStartQuiz}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Brain className="mr-2 h-5 w-5" />
          Test Your Knowledge
        </Button>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          questions={quizQuestions}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default function Roadmap({ roadmap }: { roadmap: RoadmapData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      <ReactFlowProvider>
        <RoadmapFlow roadmap={roadmap} />
      </ReactFlowProvider>
    </motion.div>
  );
}

// Helper function to generate quiz questions
function generateQuizQuestions(roadmap: RoadmapData) {
  // Generate questions based on roadmap content
  const questions = roadmap.mainTopics.map(topic => ({
    question: `What is the main focus of ${topic.title}?`,
    options: [
      topic.description,
      "Wrong answer 1",
      "Wrong answer 2",
      "Wrong answer 3"
    ],
    correctAnswer: topic.description,
    explanation: `${topic.title} focuses on ${topic.description}. This is important because ${topic.industryApplication}.`
  }));

  return questions;
}
