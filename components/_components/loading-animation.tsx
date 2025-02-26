"use client";

import Lottie from "lottie-react";
import { motion } from "framer-motion";
import roadmapLoading from "../../public/animations/roadmap-loading.json";
import dataProcessing from "../../public/animations/data-processing.json";
import aiThinking from "../../public/animations/ai-thinking.json";

interface LoadingAnimationProps {
  state: "initial" | "processing" | "finalizing";
  message?: string;
}

export const LoadingAnimation = ({ state, message }: LoadingAnimationProps) => {
  const getAnimation = () => {
    switch (state) {
      case "initial":
        return roadmapLoading;
      case "processing":
        return dataProcessing;
      case "finalizing":
        return aiThinking;
      default:
        return roadmapLoading;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-6"
    >
      <motion.div 
        className="w-80 h-80"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Lottie
          animationData={getAnimation()}
          loop={true}
          className="w-full h-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl text-gray-600 dark:text-gray-300 animate-pulse"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};
