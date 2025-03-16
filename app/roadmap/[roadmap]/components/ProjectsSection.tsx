import { motion } from 'framer-motion';
import { Code, ArrowRight } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  difficulty: string;
  steps: string[];
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Code className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold text-white">Practice Projects</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                <span className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {project.difficulty}
                </span>
              </div>

              <p className="text-gray-400 mb-6">{project.description}</p>

              {project.steps && project.steps.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Implementation Steps:</h4>
                  <ol className="space-y-2 text-sm text-gray-400">
                    {project.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-1 text-purple-500" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

