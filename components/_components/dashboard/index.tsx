"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  Search,
  Filter,
  Clock,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoadmapData } from '@/types/roadmap';
import { CalendarDialog } from '../roadmap/calendar-dialog';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inProgress' | 'completed'>('all');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapData | null>(null);

  useEffect(() => {
    // Fetch user's roadmaps from localStorage or API
    const fetchRoadmaps = () => {
      const storedRoadmaps = localStorage.getItem(`roadmaps_${userId}`);
      if (storedRoadmaps) {
        setRoadmaps(JSON.parse(storedRoadmaps));
      }
    };

    fetchRoadmaps();
  }, [userId]);

  useEffect(() => {
    // Filter roadmaps based on search query and filter type
    let filtered = roadmaps;

    if (searchQuery) {
      filtered = filtered.filter(roadmap => 
        roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(roadmap => {
        const progress = calculateProgress(roadmap);
        return filterType === 'completed' ? progress === 100 : progress < 100;
      });
    }

    setFilteredRoadmaps(filtered);
  }, [searchQuery, filterType, roadmaps]);

  const calculateProgress = (roadmap: RoadmapData): number => {
    const progress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    const totalNodes = roadmap.mainTopics.length + 
      roadmap.mainTopics.reduce((acc, topic) => acc + topic.subTopics.length, 0);
    const completedNodes = Object.values(progress).filter(status => status === 'completed').length;
    return Math.round((completedNodes / totalNodes) * 100);
  };

  const handleDownloadPDF = async (roadmap: RoadmapData) => {
    // Implement PDF download logic here
    // You can reuse the existing PDF generation logic from the roadmap component
  };

  const handleDeleteRoadmap = (roadmapId: string) => {
    const updatedRoadmaps = roadmaps.filter(r => r.id !== roadmapId);
    setRoadmaps(updatedRoadmaps);
    localStorage.setItem(`roadmaps_${userId}`, JSON.stringify(updatedRoadmaps));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your learning journey</p>
        </div>
        <Button
          onClick={() => router.push('/create-roadmap')}
          className="bg-primary hover:bg-primary/90"
        >
          Create New Roadmap
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roadmaps..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterType('all')}>
              All Roadmaps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType('inProgress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType('completed')}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRoadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl">{roadmap.title}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => router.push(`/roadmap/${roadmap.id}`)}>
                          View Roadmap
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPDF(roadmap)}>
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedRoadmap(roadmap);
                          setIsCalendarOpen(true);
                        }}>
                          Schedule Learning
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRoadmap(roadmap.id)}
                          className="text-red-600"
                        >
                          Delete Roadmap
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {roadmap.learningPath.beginner.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-2 bg-secondary rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${calculateProgress(roadmap)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{calculateProgress(roadmap)}% Complete</span>
                      <span>{roadmap.mainTopics.length} Topics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRoadmaps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No roadmaps found. Create your first roadmap to get started!</p>
        </motion.div>
      )}

      {/* Calendar Dialog */}
      {selectedRoadmap && (
        <CalendarDialog
          open={isCalendarOpen}
          onOpenChange={setIsCalendarOpen}
          roadmapTitle={selectedRoadmap.title}
        />
      )}
    </motion.div>
  );
}