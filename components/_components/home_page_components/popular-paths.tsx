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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Learning Paths
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of learners on these trending career paths
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/path/${path.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 bg-black/50 backdrop-blur-sm border-purple-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                        {path.difficulty}
                      </Badge>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1">{path.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                    <p className="text-gray-400 mb-4">{path.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {path.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-500/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {path.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {path.learners}
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
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
          className="text-center mt-12"
        >
          <Link href="/paths">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
              View All Paths <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}