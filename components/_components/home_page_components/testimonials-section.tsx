"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card } from "@/components/ui/card";

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
   
  },
  {
    id: '3',
    user: {
      name: 'Michael Brown',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    rating: 5,
    comment: 'The AI-generated roadmap for JavaScript was spot on! It saved me a lot of time and effort.',
    roadmapTitle: 'JavaScript Developer',
   
  },
  {
    id: '4',
    user: {
      name: 'Emily Johnson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    rating: 4,
    comment: 'The AI-generated roadmap for Java was very useful. It provided a clear path for me to follow.',
    roadmapTitle: 'Java Developer',
  },
  {
    id: '5',
    user: {
      name: 'David Lee',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    rating: 5,
    comment: 'The AI-generated roadmap for Ruby on Rails was exactly what I needed. It made learning Rails much easier.',
    roadmapTitle: 'Ruby on Rails Developer',
  },
  {
    id: '6',
    user: {
      name: 'Olivia White',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    },
    rating: 4,
    comment: 'The AI-generated roadmap for PHP was very helpful. It provided a clear path for me to follow.',
    roadmapTitle: 'PHP Developer',
  }
];

// Duplicate reviews to create seamless loop
const DUPLICATED_REVIEWS = [...FAKE_REVIEWS, ...FAKE_REVIEWS];

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const speedRef = useRef(0.5); // Controls scroll speed

  useAnimationFrame((time) => {
    if (!containerRef.current) return;

    scrollRef.current += speedRef.current;
    const container = containerRef.current;
    
    // Reset position when reaching end to create infinite loop
    if (scrollRef.current >= container.scrollWidth / 2) {
      scrollRef.current = 0;
    }
    
    container.scrollLeft = scrollRef.current;
  });

  // Handle hover effects
  const handleMouseEnter = () => {
    speedRef.current = 0;
  };

  const handleMouseLeave = () => {
    speedRef.current = 0.5;
  };

  return (
    <section className="py-24 bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover how our AI-powered learning paths have helped developers achieve their goals.
          </p>
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black/[0.96] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black/[0.96] to-transparent z-10" />

        {/* Testimonials Carousel */}
        <div 
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="overflow-hidden relative"
        >
          <div className="flex gap-6 whitespace-nowrap">
            {DUPLICATED_REVIEWS.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="w-[350px] min-w-[350px] md:w-[400px] md:min-w-[400px]"
              >
                <Card className="p-6 h-full bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.user.image}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{review.user.name}</h3>
                      <p className="text-sm text-purple-400">{review.roadmapTitle}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 whitespace-normal">{review.comment}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
