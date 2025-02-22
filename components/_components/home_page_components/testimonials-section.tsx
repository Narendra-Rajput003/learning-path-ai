"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const FAKE_REVIEWS = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    rating: 5,
    comment: 'The React Developer roadmap was incredibly helpful! The AI-generated path helped me structure my learning journey.',
    roadmapTitle: 'React Developer',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    user: {
      name: 'Sarah Smith',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    rating: 4,
    comment: 'Great resource for learning Python! The step-by-step approach made it easy to follow.',
    roadmapTitle: 'Python Developer',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  // Add more fake reviews as needed
];

export function TestimonialsSection() {
  const [reviews, setReviews] = useState([...FAKE_REVIEWS]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();

      if (data.success) {
        // Combine real reviews with fake ones
        setReviews([...data.data, ...FAKE_REVIEWS]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            What Our Users Say
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg bg-gray-50 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  alt={review.user.name}
                  src={review.user.image}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-0.5 text-lg font-medium text-gray-900">
                    {review.user.name}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{review.comment}</p>
              
              <div className="mt-4 text-sm text-gray-500">
                <div>{review.roadmapTitle}</div>
                <div>{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
