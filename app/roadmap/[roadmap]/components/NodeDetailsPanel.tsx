import { motion } from 'framer-motion';
import { X, Book, Video, Link, Github, FileText } from 'lucide-react';

interface NodeDetailsPanelProps {
  node: any;
  onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-6 max-h-[70vh] overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-500/20 rounded-full px-4 py-2 text-purple-400">
              {node.data.isMainTopic ? 'Main Topic' : `Step ${node.data.stepNumber} of ${node.data.totalSteps}`}
            </div>
            <h3 className="text-2xl font-bold text-white">{node.data.title}</h3>
          </div>
          <p className="text-gray-300 text-lg">{node.data.description}</p>
        </div>

        {node.data.keyConcepts && (
          <div>
            <h4 className="text-xl font-semibold text-purple-400 mb-3">Key Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {node.data.keyConcepts.map((concept: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {node.data.resources && (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-purple-400">Learning Resources</h4>
            
            {node.data.resources.documentation?.length > 0 && (
              <div>
                <h5 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                  <Book className="w-5 h-5" /> Documentation
                </h5>
                <ul className="space-y-2">
                  {node.data.resources.documentation.map((doc: any, index: number) => (
                    <li key={index}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {node.data.resources.videos?.length > 0 && (
              <div>
                <h5 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5" /> Video Tutorials
                </h5>
                <ul className="space-y-2">
                  {node.data.resources.videos.map((video: any, index: number) => (
                    <li key={index}>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        {video.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {node.data.resources.articles?.length > 0 && (
              <div>
                <h5 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                  <Link className="w-5 h-5" /> Articles
                </h5>
                <ul className="space-y-2">
                  {node.data.resources.articles.map((article: any, index: number) => (
                    <li key={index}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                      >
                        <Link className="w-4 h-4" />
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {node.data.projects && (
          <div>
            <h4 className="text-xl font-semibold text-purple-400 mb-3">Practice Projects</h4>
            <div className="space-y-4">
              {node.data.projects.map((project: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <h5 className="text-lg font-medium text-white mb-2">{project.title}</h5>
                  <p className="text-gray-300 mb-3">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                      {project.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}