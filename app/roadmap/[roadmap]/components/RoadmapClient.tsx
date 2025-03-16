"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapFlow from './RoadmapFlow';
import { Code } from 'lucide-react';
import ProjectsModal from './ProjectsModal';
import { RoadmapReviewModal } from '@/components/RoadmapReviewModal';

interface RoadmapClientProps {
  data: {
    title: string;
    description: string;
    overview: {
      description: string;
      prerequisites: string[];
      learningApproach: string[];
      estimatedTime: string;
    };
    fundamentalTopics: Array<{
      id: string;
      title: string;
      description: string;
      keyConcepts: string[];
      projects: Array<{
        title: string;
        description: string;
        difficulty: string;
        steps: string[];
        timeEstimate: string;
        prerequisites: string[];
        resources: {
          documentation: Array<{ title: string; url: string }>;
          tutorials: Array<{ title: string; url: string }>;
          githubRepos: Array<{ title: string; url: string }>;
        };
      }>;
      resources: {
        documentation: Array<{ title: string; url: string }>;
        tutorials: Array<{ title: string; url: string }>;
        githubRepos: Array<{ title: string; url: string }>;
      };
    }>;
    beginnerTopics: Array<any>;
    intermediateTopics: Array<any>;
    advancedTopics: Array<any>;
  };
}

export default function RoadmapClient({ data }: RoadmapClientProps) {
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  // Extract all projects from the roadmap data
  const allProjects = [
    ...(data.fundamentalTopics || []),
    ...(data.beginnerTopics || []),
    ...(data.intermediateTopics || []),
    ...(data.advancedTopics || [])
  ].flatMap(topic => topic.projects || []);

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">{data.title}</h1>
          <p className="text-gray-400 text-lg">{data.description}</p>
          
          {/* Overview Section */}
          {data.overview && (
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white">Overview</h2>
              <p className="text-gray-300">{data.overview.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.overview.prerequisites && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Prerequisites</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {data.overview.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.overview.learningApproach && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Learning Approach</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {data.overview.learningApproach.map((approach, index) => (
                        <li key={index}>{approach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {data.overview.estimatedTime && (
                  <div className="text-purple-400">
                    <span className="font-medium">Estimated Time: </span>
                    {data.overview.estimatedTime}
                  </div>
                )}
                <button
                  onClick={() => setIsProjectsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  View Practice Projects
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Roadmap Flow */}
      <div className="max-w-7xl mx-auto px-4">
        <RoadmapFlow roadmapData={data} />
      </div>

      {/* Projects Modal */}
      <AnimatePresence>
        {isProjectsModalOpen && (
          <ProjectsModal
            projects={allProjects}
            onClose={() => setIsProjectsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Add Review Modal */}
      <RoadmapReviewModal roadmapTitle={data.title} />
    </div>
  );
}




