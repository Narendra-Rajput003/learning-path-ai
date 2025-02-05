"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
    quote: "The AI-generated learning path helped me transition from a beginner to a professional developer in just 6 months."
  },
  {
    name: "Michael Rodriguez",
    role: "Frontend Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150",
    quote: "The interactive mind maps and project-based learning approach made complex concepts easy to understand."
  },
  {
    name: "Emily Johnson",
    role: "Backend Developer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
    quote: "The interview preparation feature gave me the confidence to ace my technical interviews."
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by Learners
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful developers who transformed their careers
            using our platform.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-full object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}