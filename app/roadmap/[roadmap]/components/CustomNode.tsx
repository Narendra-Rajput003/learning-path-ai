import { Handle, Position } from 'reactflow';
import { Book, Code } from 'lucide-react';
import { useState } from 'react';
import ProjectsModal from './ProjectsModal';

export default function CustomNode({ data }) {
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  const getTypeStyles = () => {
    const baseStyles = "w-[280px] rounded-xl p-6 transition-all duration-300 border";
    switch (data.type) {
      case 'fundamental':
        return `${baseStyles} bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40`;
      case 'beginner':
        return `${baseStyles} bg-green-500/10 border-green-500/20 hover:border-green-500/40`;
      case 'intermediate':
        return `${baseStyles} bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40`;
      case 'advanced':
        return `${baseStyles} bg-red-500/10 border-red-500/20 hover:border-red-500/40`;
      default:
        return `${baseStyles} bg-gray-500/10 border-gray-500/20 hover:border-gray-500/40`;
    }
  };

  return (
    <div className={getTypeStyles()}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-purple-500 !w-3 !h-3" 
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-gray-300">
            Step {data.stepNumber}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-gray-300">
            {data.type}
          </span>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{data.title}</h3>
          <p className="text-sm text-gray-300">{data.description}</p>
        </div>

        {data.keyConcepts?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.keyConcepts.map((concept, i) => (
              <span 
                key={i} 
                className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-300"
              >
                {concept}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {data.resources && (
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
              onClick={() => window.open(data.resources.documentation?.[0]?.url, '_blank')}
            >
              <Book className="w-3 h-3" />
              Resources
            </button>
          )}
          
          {data.projects?.length > 0 && (
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
              onClick={() => setIsProjectsModalOpen(true)}
            >
              <Code className="w-3 h-3" />
              Projects ({data.projects.length})
            </button>
          )}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-purple-500 !w-3 !h-3" 
      />

      {isProjectsModalOpen && (
        <ProjectsModal
          projects={data.projects}
          onClose={() => setIsProjectsModalOpen(false)}
        />
      )}
    </div>
  );
}



