"use client";

import { motion } from "framer-motion";
import { Brain, Code, Layout, LineChart, MessageSquare, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Brain className="h-10 w-10" />,
    title: "AI-Generated Learning Paths",
    description: "Personalized roadmaps created by Google Gemini AI based on your goals"
  },
  {
    icon: <Layout className="h-10 w-10" />,
    title: "Mind Map Visualization",
    description: "Interactive mind maps for clear learning progression"
  },
  {
    icon: <Code className="h-10 w-10" />,
    title: "Comprehensive Resources",
    description: "Curated tutorials, projects, and reference materials"
  },
  {
    icon: <LineChart className="h-10 w-10" />,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics"
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Personalized Recommendations",
    description: "AI-powered suggestions for skill enhancement"
  },
  {
    icon: <MessageSquare className="h-10 w-10" />,
    title: "Interview Preparation",
    description: "Practice with AI-generated interview questions"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI technology with proven learning methodologies
            to create the most effective learning experience.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/95">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}