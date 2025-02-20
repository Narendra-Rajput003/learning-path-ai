"use client";

import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Video, Code, Link2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Resource, Project } from '@/types/roadmap';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NodeData {
  type: 'mainTopic' | 'subTopic';
  label: string;
  description?: string;
  prerequisites?: string[];
  resources?: Resource[];
  projects?: Project[];
}

const ResourceIcon = ({ type }: { type: Resource['type'] }) => {
  const icons = {
    documentation: Book,
    video: Video,
    tutorial: Code,
    article: Link2,
  };
  const Icon = icons[type];
  return <Icon className="w-4 h-4" />;
};

const CustomNode = memo(({ data }: { data: NodeData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isMainTopic = data.type === 'mainTopic';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`!bg-purple-500 ${currentTheme === 'dark' ? '!border-gray-700' : '!border-gray-200'}`} 
      />
      <Card
        className={`
          ${isMainTopic 
            ? currentTheme === 'dark'
              ? 'bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-700'
              : 'bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-600'
            : currentTheme === 'dark'
              ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
              : 'bg-white border-purple-200 hover:border-purple-400'
          }
          p-4 min-w-[250px] max-w-[350px]
          transition-all duration-300
          ${isMainTopic ? 'text-white' : currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}
        `}
      >
        <div className="flex justify-between items-start gap-2">
          <h3 className={`font-bold ${isMainTopic ? 'text-xl' : 'text-lg'} mb-2`}>
            {data.label}
          </h3>
          {!isMainTopic && (data.resources?.length || data.projects?.length) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {data.description && (
          <p className={`text-sm mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.description}
          </p>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {data.resources && data.resources.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`text-sm font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Resources
                  </h4>
                  <div className="space-y-1">
                    {data.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          flex items-center gap-2 text-sm p-2 rounded-md
                          ${currentTheme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:bg-gray-100'}
                          transition-colors
                        `}
                      >
                        <ResourceIcon type={resource.type} />
                        <span>{resource.title}</span>
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {data.projects && data.projects.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`text-sm font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Practice Projects
                  </h4>
                  <div className="space-y-2">
                    {data.projects.map((project, index) => (
                      <div
                        key={index}
                        className={`
                          p-2 rounded-md text-sm
                          ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                        `}
                      >
                        <div className="font-medium mb-1">{project.title}</div>
                        <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!bg-purple-500 ${currentTheme === 'dark' ? '!border-gray-700' : '!border-gray-200'}`}
      />
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';
export default CustomNode;
