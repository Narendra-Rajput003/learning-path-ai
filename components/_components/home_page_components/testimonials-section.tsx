"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const speedRef = useRef(0.5);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews?limit=10');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Create duplicated array for infinite scroll
          const reviewsData = [...data.data, ...data.data];
          setReviews(reviewsData);
        } else {
          throw new Error('No reviews found');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load testimonials",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [toast]);

  useAnimationFrame(() => {
    if (!containerRef.current || reviews.length === 0) return;

    scrollRef.current += speedRef.current;
    const container = containerRef.current;
    
    if (scrollRef.current >= container.scrollWidth / 2) {
      scrollRef.current = 0;
    }
    
    container.scrollLeft = scrollRef.current;
  });

  const handleMouseEnter = () => speedRef.current = 0;
  const handleMouseLeave = () => speedRef.current = 0.5;

  if (isLoading) {
    return <div className="py-24 text-center text-gray-400">Loading testimonials...</div>;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
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

        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black/[0.96] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black/[0.96] to-transparent z-10" />

        <div 
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="overflow-hidden relative"
        >
          <div className="flex gap-6 whitespace-nowrap">
            {reviews.map((review, index) => (
              <div
                key={`${review._id}-${index}`}
                className="w-[350px] min-w-[350px] md:w-[400px] md:min-w-[400px]"
              >
                <Card className="p-6 h-full bg-black/40 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.userImage || '/default-avatar.png'}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{review.userName}</h3>
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
                  <p className="text-gray-300 line-clamp-4">{review.comment}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
