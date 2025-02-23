"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="relative w-10 h-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Brain Circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            className="stroke-purple-500"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Neural Network Lines */}
          <motion.path
            d="M12 20C12 14 20 14 20 20C20 26 28 26 28 20"
            className="stroke-purple-500"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Connection Points */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <circle cx="12" cy="20" r="2" className="fill-purple-500" />
            <circle cx="20" cy="20" r="2" className="fill-purple-500" />
            <circle cx="28" cy="20" r="2" className="fill-purple-500" />
          </motion.g>
        </svg>
      </motion.div>

      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
        >
          LearningPath.ai
        </motion.span>
      )}
    </Link>
  );
}