// app/roadmap/[roadmap]/page.tsx
"use client";

import Roadmap from "@/components/_components/roadmap/roadmap";
import { motion } from "framer-motion";
import { useEffect, useState, use } from "react";
import { RoadmapData } from "@/types/roadmap";
import { toast } from "sonner";


const RoadmapHome = ({ params }: { params: Promise<{ roadmap: string }> }) => {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const roadmapTitle = decodeURIComponent(resolvedParams.roadmap).replace(/-/g, ' ');
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching roadmap for:', roadmapTitle); // Debug log

        const response = await fetch('/api/roadmaps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: roadmapTitle }),
        });

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate roadmap');
        }

        if (data.success && data.data && data.data.mainTopics && data.data.mainTopics.length > 0) {
          setRoadmapData(data.data);
        } else {
          console.error('Invalid response format:', data); // Debug log
          throw new Error('Invalid response format or empty roadmap data');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error generating roadmap";
        console.error("Error details:", error); // Debug log
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, [roadmapTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-gray-800 mb-8"
      >
        Learning Roadmap: {roadmapTitle}
      </motion.h1>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && roadmapData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Roadmap roadmap={roadmapData} />
        </motion.div>
      )}

      {!isLoading && !roadmapData && (
        <div className="text-center text-gray-600">
          <p>No roadmap data available. Please try again.</p>
          <p className="text-sm mt-2">Title: {roadmapTitle}</p>
        </div>
      )}
    </div>
  );
};

export default RoadmapHome;



