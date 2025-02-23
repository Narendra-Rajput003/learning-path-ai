"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, Brain, Search } from "lucide-react"
import { RoboAnimation } from "./robo-animation"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
import { Input } from "@/components/ui/input"

export default function Hero() {
  const [techStack, setTechStack] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const typingRef = useRef(null)
  const containerRef = useRef(null)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  const techStacks = [
    "Full Stack Developer",
    "MERN Stack",
    "AI/ML Engineer",
    "Blockchain Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Cybersecurity Expert",
    "Game Developer",
    "Cloud Architect",
  ]

  // Optimized typing effect with useCallback
  const typeText = useCallback(
    debounce((fullText: string, currentText: string, isDeleting: boolean) => {
      if (!typingRef.current) return

      const newText = isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1)

      setPlaceholder(newText)

      if (!isDeleting && newText === fullText) {
        setTimeout(() => setIsTyping(false), 1800)
        return true
      }
      return false
    }, 100),
    []
  )

  useEffect(() => {
    let currentIndex = 0
    let isDeleting = false

    const animateText = async () => {
      const fullText = techStacks[currentIndex]
      const shouldDelete = await typeText(fullText, placeholder, isDeleting)

      if (shouldDelete) {
        isDeleting = true
      } else if (isDeleting && placeholder === "") {
        isDeleting = false
        currentIndex = (currentIndex + 1) % techStacks.length
      }
    }

    const intervalId = setInterval(animateText, 100)
    return () => clearInterval(intervalId)
  }, [techStacks, placeholder, typeText])

  const handleSubmit = useCallback(() => {
    if (techStack.trim() === "") {
      setError("Please enter your tech stack")
      return
    }
    setError("")
    router.push(`/roadmap/${encodeURIComponent(techStack)}`)
  }, [techStack, router])

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative min-h-[calc(100vh-76px)] flex items-center bg-black/[0.96] antialiased bg-grid-white/[0.02]  overflow-hidden"
    >
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Master Your Tech Journey with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-gradient">
                {" "}AI-Powered Learning
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder={placeholder}
                className="w-full px-6 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-gray-400 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <span className="typing-cursor">|</span>
                </motion.div>
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
              onClick={handleSubmit}
            >
              <Brain className="mr-2 h-5 w-5" />
              Generate Learning Path
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-500/30 text-white hover:bg-purple-500/20 px-8 py-6 rounded-full text-lg font-medium transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Explore Paths
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
      >
        <RoboAnimation />
      </motion.div>
    </motion.div>
  )
}
