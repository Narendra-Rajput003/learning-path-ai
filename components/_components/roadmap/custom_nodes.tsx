import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from "framer-motion";
import React from 'react';

interface NodeData {
  type: 'mainTopic' | string;
  label: string;
  description?: string;
  prerequisites?: string[];
  resources?: Array<{
    title: string;
    url: string;
  }>;
}

const CustomNode = ({ data }: { data: NodeData }) => {
  const isMainTopic = data.type === "mainTopic";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${
        isMainTopic 
          ? 'bg-blue-100 border-blue-500' 
          : 'bg-white border-green-500'
      } border-2 rounded-lg shadow-md p-4 max-w-xs`}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="space-y-2">
        <h3 className={`font-bold ${isMainTopic ? 'text-lg text-blue-700' : 'text-md text-green-700'}`}>
          {data.label}
        </h3>
        
        {data.description && (
          <p className="text-sm text-gray-600">{data.description}</p>
        )}

        {Array.isArray(data.prerequisites) && data.prerequisites.length > 0 && (
          <div className="text-xs">
            <span className="font-semibold">Prerequisites:</span>
            <ul className="list-disc list-inside">
              {data.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        {!isMainTopic && data.resources && (
          <div className="text-xs mt-2">
            <span className="font-semibold">Resources:</span>
            <ul className="list-disc list-inside">
              {data.resources.slice(0, 2).map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default memo(CustomNode);
