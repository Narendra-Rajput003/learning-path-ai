"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ArrowRight, Book, Link, Github } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  difficulty: string;
  steps: string[];
  timeEstimate: string;
  prerequisites: string[];
  resources: {
    documentation: Array<{ title: string; url: string }>;
    tutorials: Array<{ title: string; url: string }>;
    githubRepos: Array<{ title: string; url: string }>;
  };
}

export default function PracticalProjects({ projects, topicTitle }: { projects: Project[]; topicTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
      >
        <Code className="w-4 h-4" />
        View Practice Projects
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 py-16">
              <div className="max-w-4xl mx-auto bg-black/90 rounded-xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Practice Projects: {topicTitle}</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-8">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                          {project.difficulty}
                        </span>
                      </div>

                      <p className="text-gray-300">{project.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Time Estimate</h4>
                          <p className="text-gray-400">{project.timeEstimate}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Prerequisites</h4>
                          <ul className="list-disc list-inside text-gray-400">
                            {project.prerequisites.map((prereq, i) => (
                              <li key={i}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-white">Implementation Steps</h4>
                        <ol className="space-y-2">
                          {project.steps.map((step, i) => (
                            <li key={i} className="flex gap-2 text-gray-300">
                              <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-white">Resources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(project.resources).map(([type, items]) => (
                            <div key={type} className="space-y-2">
                              <h5 className="text-purple-400 flex items-center gap-2">
                                {type === 'documentation' && <Book className="w-4 h-4" />}
                                {type === 'tutorials' && <Link className="w-4 h-4" />}
                                {type === 'githubRepos' && <Github className="w-4 h-4" />}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </h5>
                              <ul className="space-y-1">
                                {items.map((item, i) => (
                                  <li key={i}>
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {item.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}