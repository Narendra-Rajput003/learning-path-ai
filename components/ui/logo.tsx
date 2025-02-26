"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1.5`}>
          <Brain className="w-full h-full text-white" />
        </div>
      </motion.div>

      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`font-bold ${textSizeClasses[size]} bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
        >
          LearningPath.ai
        </motion.span>
      )}
    </Link>
  );
}