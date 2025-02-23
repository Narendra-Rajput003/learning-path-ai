"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about our platform? Want to learn more about our AI-powered learning paths?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Email Us</h3>
                <p className="text-gray-400">support@learningpath.ai</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                <p className="text-gray-400">Available 24/7 for your questions</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-400"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="min-h-[150px] bg-black/40 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
