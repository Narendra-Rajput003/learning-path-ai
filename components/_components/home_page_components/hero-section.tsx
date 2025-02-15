"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {  Sparkles } from "lucide-react"
// import { FloatingPaper } from "@/components/_components/home_page_components/floating-paper"
import { RoboAnimation } from "@/components/_components/home_page_components/robo-animation"
import { useState, useEffect } from "react"

export default function Hero() {
  const [techStack, setTechStack] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const techStacks = ["Full Stack Developer", "MERN Stack", "AI/ML Engineer", "Blockchain Developer", "DevOps Engineer", "Data Scientist" ,"Cybersecurity Expert" ,"Game Developer","Cloud Architect"]
  const typingSpeed = 100
  const deletingSpeed = 90
  const pauseDuration = 1800

  useEffect(() => {
    let currentIndex = 0
    let currentText = ""
    let isDeleting = false

    const type = () => {
      const fullText = techStacks[currentIndex]

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1)
      } else {
        currentText = fullText.substring(0, currentText.length + 1)
      }

      setPlaceholder(currentText)

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsTyping(false), pauseDuration)
        isDeleting = true
      } else if (isDeleting && currentText === "") {
        isDeleting = false
        currentIndex = (currentIndex + 1) % techStacks.length
      }

      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed)
    }

    type()
  }, [])

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
     
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Revolutionize Your Learning Experience with the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Power of AI-Driven Journeys
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            
            At learningpath.ai, we’re building a collaborative platform to craft detailed roadmaps, comprehensive guides, and cutting-edge educational resources.
          </motion.p>

          {/* Animated Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder={placeholder}
                className="w-full px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400 outline-none transition-all duration-300 text-center"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isTyping ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-purple-500 "
              >
                ✍️
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          
          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}