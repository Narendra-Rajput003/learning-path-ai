"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Typewriter from "typewriter-effect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiClient } from "@/lib/api-client";

export function HeroSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter a topic");

  const handleGenerate = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (!topic) return;

    try {
      setIsLoading(true);
      const apiClient = ApiClient.getInstance();
      const response = await apiClient.generateLearningPath(topic);

      if (!response.error) {
        router.push(`/learning-path/${response.data.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Master Any Tech Stack with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                AI-Powered Learning
              </span>
            </h1>

            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={topic ? "" : placeholder} // Show placeholder only when input is empty
                  className="text-lg py-6 pr-32"
                />
                <Button
                  size="lg"
                  className="absolute right-1 top-1 bottom-1"
                  onClick={handleGenerate}
                  disabled={isLoading || !topic}
                >
                  {isLoading ? "Generating..." : "Generate"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* Typewriter effect over input placeholder */}
                {!topic && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none text-lg">
                    <Typewriter
                      options={{
                        strings: [
                          "MERN Stack",
                          "Machine Learning",
                          "Cloud Computing",
                          "DevOps",
                          "React Native",
                          "Blockchain Development",
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 60,
                        deleteSpeed: 40,
                        cursor: "",
                      }}
                      onInit={(typewriter) => {
                        typewriter.callFunction(() => {
                          setPlaceholder(typewriter.options.strings[0]);
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-2">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                alt="Learning Platform"
                className="rounded-xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
