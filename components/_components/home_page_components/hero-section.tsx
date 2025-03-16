"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, Brain, Search, X } from "lucide-react"
import { RoboAnimation } from "./robo-animation"
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const containerRef = useRef(null)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  const clearInput = () => {
    if (isLoading) return; // Prevent clearing while loading
    setSearchQuery("")
    setError("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSubmit = useCallback(async (value?: string) => {
    // Prevent submission if already loading
    if (isLoading) return;

    const submitValue = value || searchQuery;
    if (submitValue.trim() === "") {
      setError("Please enter a technology stack")
      return;
    }

    setError("")
    setIsLoading(true)

    try {
      // Disable the input and button during loading
      if (inputRef.current) {
        inputRef.current.disabled = true;
      }

      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      router.push(`/roadmap/${encodeURIComponent(submitValue.toLowerCase().replace(/\s+/g, '-'))}`)
    } catch (error) {
      setError("Failed to generate roadmap")
      // Re-enable the input on error
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
      setIsLoading(false)
    }
  }, [searchQuery, router, isLoading])

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  }

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className={`relative min-h-[calc(100vh-76px)] flex items-center bg-black/[0.96] antialiased bg-grid-white/[0.02] overflow-hidden ${isLoading ? 'pointer-events-none' : ''}`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white text-lg">Generating your roadmap...</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-blue-500/20" />
      <div className="absolute inset-0 blur-[120px] bg-gradient-to-br from-purple-500/30 via-transparent to-blue-500/30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Generate Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-gradient">
                {" "}Learning Roadmap{" "}
              </span>
              with AI
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Enter any technology stack to get a personalized learning path
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-2xl mx-auto w-full px-4 sm:px-0"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., React.js, Machine Learning, Python..."
                className={`w-full px-12 py-6 rounded-full bg-white/10 backdrop-blur-lg border-2 
                  ${isLoading ? 'border-purple-500/50 opacity-50' : 'border-purple-500/30'} 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 
                  text-white placeholder-gray-400 text-lg
                  ${isLoading ? 'cursor-not-allowed' : 'cursor-text'}`}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              {searchQuery && !isLoading && (
                <button
                  onClick={clearInput}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mt-2 text-sm text-center"
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
              className={`bg-gradient-to-r from-purple-600 to-blue-600 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-blue-700'} 
                text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 
                transform ${isLoading ? '' : 'hover:scale-105'}`}
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Roadmap...
                </div>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Generate Learning Path
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
