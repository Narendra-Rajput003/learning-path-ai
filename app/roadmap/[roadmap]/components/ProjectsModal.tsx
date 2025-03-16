import { motion } from 'framer-motion';
import { 
  Code, 
  ArrowRight, 
  Book, 
  Link, 
  Github, 
  X, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  Star,
  Calendar
} from 'lucide-react';

interface Project {
  title: string;
  description: string;
  difficulty: string;
  steps: string[];
  timeEstimate: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  resources: {
    documentation: Array<{ title: string; url: string }>;
    tutorials: Array<{ title: string; url: string }>;
    githubRepos: Array<{ title: string; url: string }>;
  };
  challengeLevel: 1 | 2 | 3 | 4 | 5;
  tags?: string[];
  bestPractices?: string[];
}

interface ProjectsModalProps {
  projects?: Project[];
  onClose: () => void;
}

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    Beginner: 'bg-green-500/10 text-green-400',
    Intermediate: 'bg-yellow-500/10 text-yellow-400',
    Advanced: 'bg-red-500/10 text-red-400'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[difficulty] || 'bg-purple-500/10 text-purple-400'}`}>
      {difficulty}
    </span>
  );
};

const ChallengeStars = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < level ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
};

const ProjectMetaInfo = ({ project }: { project: Project }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-purple-400" />
        <div>
          <h4 className="font-medium text-white">Time Estimate</h4>
          <p className="text-gray-400">{project.estimatedHours || 0} hours</p>
          <p className="text-sm text-gray-500">({project.timeEstimate || 'N/A'})</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Target className="w-5 h-5 text-purple-400" />
        <div>
          <h4 className="font-medium text-white">Skill Level</h4>
          <p className="text-gray-400">{project.skillLevel || 'Not specified'}</p>
          <p className="text-sm text-gray-500">Level {project.challengeLevel || 1}/5</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-purple-400" />
        <div>
          <h4 className="font-medium text-white">Required Time</h4>
          <p className="text-gray-400">{project.timeEstimate || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

const PrerequisitesList = ({ prerequisites = [] }: { prerequisites?: string[] }) => {
  if (!prerequisites || prerequisites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-white flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-400" />
        Prerequisites
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {prerequisites.map((prereq, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{prereq}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProjectsModal({ projects = [], onClose }: ProjectsModalProps) {
  if (!projects || projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 py-16">
          <div className="max-w-4xl mx-auto bg-black/90 rounded-xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Practice Projects</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-400">No projects available at this time.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto bg-black/90 rounded-xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Practice Projects</h2>
              <p className="text-gray-400 mt-2">Total {projects.length} projects available</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-white/10 rounded-lg p-8 space-y-6 relative"
              >
                {/* Project Number Badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <div className="flex items-center gap-4">
                    <DifficultyBadge difficulty={project.difficulty} />
                    <ChallengeStars level={project.challengeLevel} />
                  </div>
                </div>

                <p className="text-gray-300 text-lg">{project.description}</p>

                {/* Project Meta Information */}
                <ProjectMetaInfo project={project} />

                {/* Prerequisites */}
                {project.prerequisites && project.prerequisites.length > 0 && (
                  <PrerequisitesList prerequisites={project.prerequisites} />
                )}

                {/* Learning Outcomes */}
                {project.learningOutcomes && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Learning Outcomes
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.learningOutcomes.map((outcome, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Implementation Steps */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    Implementation Steps
                  </h4>
                  <ol className="space-y-3">
                    {project.steps?.map((step, i) => (
                      <li key={i} className="flex gap-4 text-gray-300 bg-white/5 p-4 rounded-lg">
                        <span className="font-bold text-purple-400 w-8">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Resources */}
                {project.resources && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      <Book className="w-5 h-5 text-purple-400" />
                      Learning Resources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(project.resources).map(([type, items]) => (
                        <div key={type} className="bg-white/5 rounded-lg p-4">
                          <h5 className="text-purple-400 flex items-center gap-2 mb-3">
                            {type === 'documentation' && <Book className="w-4 h-4" />}
                            {type === 'tutorials' && <Link className="w-4 h-4" />}
                            {type === 'githubRepos' && <Github className="w-4 h-4" />}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </h5>
                          <ul className="space-y-2">
                            {items.map((item, i) => (
                              <li key={i}>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                  {item.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}



