import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Book, 
  Video, 
  FileText, 
  Code, 
  Award,
  Clock,
  AlertTriangle,
  ExternalLink,
  Github
} from 'lucide-react';
import { CheckCircle, Circle } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  description?: string;
  platform?: string;
  duration?: string;
}

interface Project {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  requirements?: string[];
  steps?: string[];
  expectedOutcome?: string;
  additionalChallenges?: string[];
}

interface NodeData {
  id: string;
  type: 'mainTopic' | 'subTopic';
  label: string;
  description?: string;
  difficulty?: string;
  timeEstimate?: string;
  prerequisites?: string[];
  concepts?: string[];
  keyPoints?: string[];
  commonPitfalls?: string[];
  status: 'completed' | 'pending';
  projects?: Project[];
  resources?: {
    documentation?: Resource[];
    videos?: Resource[];
    tutorials?: Resource[];
    articles?: Resource[];
    books?: Resource[];
    github?: Resource[];
  };
  practicalExercises?: Array<{
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    steps: string[];
  }>;
}

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

const CustomNode = ({ data }: CustomNodeProps) => {
  const isMainTopic = data.type === "mainTopic";

  const handleStatusChange = () => {
    // Handle status change through React Flow's setNodes
    const event = new CustomEvent('nodeStatusChange', {
      detail: { 
        id: data.id, 
        status: data.status === 'completed' ? 'pending' : 'completed' 
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md group"
    >
      <Card className={`
        ${isMainTopic 
          ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10' 
          : 'border border-secondary bg-background/95'}
        shadow-lg hover:shadow-xl transition-all duration-300
        backdrop-blur-sm
        ${isMainTopic ? 'w-[400px]' : 'w-[300px]'}
      `}>
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleStatusChange}
            className="hover:scale-110 transition-transform"
          >
            {data.status === 'completed' ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>

        <Handle 
          type="target" 
          position={Position.Top} 
          className="!bg-primary !w-3 !h-3" 
        />
        
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className={`
              ${isMainTopic ? 'text-xl' : 'text-lg'}
              group-hover:text-primary transition-colors
            `}>
              {data.label}
            </CardTitle>
            {data.difficulty && (
              <Badge variant={
                data.difficulty === 'beginner' ? 'default' :
                data.difficulty === 'intermediate' ? 'secondary' : 'destructive'
              } className="animate-pulse">
                {data.difficulty}
              </Badge>
            )}
          </div>
          {data.timeEstimate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <Clock className="w-4 h-4 mr-1" />
              {data.timeEstimate}
            </motion.div>
          )}
          <CardDescription className="line-clamp-2">
            {data.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {data.prerequisites && data.prerequisites.length > 0 && (
              <AccordionItem value="prerequisites">
                <AccordionTrigger>Prerequisites</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4">
                    {data.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {data.keyPoints && data.keyPoints.length > 0 && (
              <AccordionItem value="keyPoints">
                <AccordionTrigger>Key Points</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4">
                    {data.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {data.resources && (
              <AccordionItem value="resources">
                <AccordionTrigger>Learning Resources</AccordionTrigger>
                <AccordionContent>
                  {data.resources.videos && data.resources.videos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold flex items-center mb-2">
                        <Video className="w-4 h-4 mr-2" /> Video Tutorials
                      </h4>
                      <ul className="space-y-2">
                        {data.resources.videos.map((video, idx) => (
                          <li key={idx}>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                            >
                              {video.title}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.resources.articles && data.resources.articles.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold flex items-center mb-2">
                        <FileText className="w-4 h-4 mr-2" /> Articles
                      </h4>
                      <ul className="space-y-2">
                        {data.resources.articles.map((article, idx) => (
                          <li key={idx}>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                            >
                              {article.title}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {data.resources.github && data.resources.github.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold flex items-center mb-2">
                        <Github className="w-4 h-4 mr-2" /> GitHub Repositories
                      </h4>
                      <ul className="space-y-2">
                        {data.resources.github.map((repo, idx) => (
                          <li key={idx}>
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                            >
                              {repo.title}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {data.projects && data.projects.length > 0 && (
              <AccordionItem value="projects">
                <AccordionTrigger>Practice Projects</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {data.projects.map((project, idx) => (
                      <li key={idx} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{project.difficulty}</Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {project.estimatedTime}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {data.commonPitfalls && data.commonPitfalls.length > 0 && (
              <AccordionItem value="pitfalls">
                <AccordionTrigger>Common Pitfalls</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {data.commonPitfalls.map((pitfall, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500 mt-1" />
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>

        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!bg-primary !w-3 !h-3" 
        />
      </Card>
    </motion.div>
  );
};

export default memo(CustomNode);
