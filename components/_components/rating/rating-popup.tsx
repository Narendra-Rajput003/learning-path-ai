"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewForm } from './review-form';

interface RatingPopupProps {
  roadmapTitle: string;
  onClose: () => void;
}

export function RatingPopup({ roadmapTitle, onClose }: RatingPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 60000); // 1 minute delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">How was your experience?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please rate your experience with the {roadmapTitle} roadmap
            </p>
            <ReviewForm roadmapTitle={roadmapTitle} onSubmitSuccess={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}