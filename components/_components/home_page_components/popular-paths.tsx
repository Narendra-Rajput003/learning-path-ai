"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Clock, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const popularPaths = [
  {
    title: "Full Stack Development",
    description: "Master both frontend and backend development",
    difficulty: "Intermediate",
    duration: "6 months",
    learners: "15K+",
    rating: 4.8,
    image: "/path-images/fullstack.jpg",
    tags: ["React", "Node.js", "MongoDB", "Express"],
  },
  {
    title: "AI/ML Engineering",
    description: "Learn machine learning and artificial intelligence",
    difficulty: "Advanced",
    duration: "8 months",
    learners: "10K+",
    rating: 4.9,
    image: "/path-images/ai-ml.jpg",
    tags: ["Python", "TensorFlow", "PyTorch", "Data Science"],
  },
  {
    title: "Cloud Architecture",
    description: "Build and deploy scalable cloud solutions",
    difficulty: "Intermediate",
    duration: "5 months",
    learners: "12K+",
    rating: 4.7,
    image: "/path-images/cloud.jpg",
    tags: ["AWS", "Azure", "Docker", "Kubernetes"],
  },
]

export function PopularPaths() {
  return (
    <section className="py-24 bg-gradient-to-b from-black/90 to-purple-900/20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Popular Learning Paths
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners on these trending career paths
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {popularPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/path/${path.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="relative overflow-hidden bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-sm border-2 border-purple-500/20 rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-50" />
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <Badge 
                        variant="outline" 
                        className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1 text-sm"
                      >
                        {path.difficulty}
                      </Badge>
                      <div className="flex items-center bg-yellow-400/10 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 text-yellow-400 font-medium">{path.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                      {path.title}
                    </h3>
                    <p className="text-gray-300 mb-6 line-clamp-2">
                      {path.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {path.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-purple-500/10 text-purple-300 border-none"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-300 bg-black/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>{path.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span>{path.learners}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link href="/paths">
            <Button 
              variant="ghost" 
              className="text-purple-300 bg-purple-500/10 border border-purple-500/20 px-6 py-2 text-lg"
            >
              View All Paths <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
