"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CreateRoadmapDialog() {
  const [techStack, setTechStack] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!techStack.trim()) return;
    
    setIsLoading(true);
    try {
      router.push(`/roadmap/${encodeURIComponent(techStack)}`);
    } catch (error) {
      console.error('Error creating roadmap:', error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          Create New Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Learning Roadmap</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter technology stack (e.g., Full Stack Developer, AI Engineer)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
          <Button 
            className="w-full" 
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}