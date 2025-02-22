// app/roadmap/[roadmap]/page.tsx
"use client";

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {LoadingAnimation} from '@/components/_components/loading-animation';
import Roadmap from '@/components/_components/roadmap';

export default function RoadmapPage({ params }: { params: Promise<{ roadmap: string }> }) {
  const resolvedParams = use(params);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'initial' | 'processing' | 'finalizing'>('initial');

  const roadmapTitle = decodeURIComponent(resolvedParams.roadmap);

  useEffect(() => {
    let mounted = true;

    const fetchRoadmapData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        setLoadingState('initial');

        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!mounted) return;
        setLoadingState('processing');

        const response = await fetch('/api/roadmaps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ title: roadmapTitle }),
        });

        const data = await response.json();

        if (!mounted) return;

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch roadmap data');
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!mounted) return;
        setLoadingState('finalizing');

        if (data.success) {
          setRoadmapData(data.data);
          toast.success('Roadmap generated successfully!');
        } else {
          throw new Error(data.error || 'Failed to generate roadmap');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!mounted) return;
        setIsLoading(false);

      } catch (error) {
        if (!mounted) return;
        console.error("Error fetching roadmap:", error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setIsLoading(false);
        toast.error('Failed to generate roadmap. Please try again.');
      }
    };

    fetchRoadmapData();

    return () => {
      mounted = false;
    };
  }, [roadmapTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8"
      >
        Learning Roadmap: {roadmapTitle}
      </motion.h1>

      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[600px]"
        >
          <LoadingAnimation 
            state={loadingState}
            message={
              loadingState === "initial" 
                ? "Initializing your personalized roadmap..." 
                : loadingState === "processing"
                ? "Analyzing learning paths and resources..."
                : "Finalizing your learning journey..."
            }
          />
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-600 dark:text-red-400 p-8"
        >
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {roadmapData ? (
            <Roadmap roadmap={roadmapData} />
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p className="text-lg">No roadmap data available. Please try again.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};





